import classNames from "classnames";
import PlantFilters from "components/plantFilters/PlantFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Modal from "designSystem/Modal";
import Sidebar from "designSystem/Sidebar";
import _ from "lodash";
import { FormEvent, useState } from "react";
import { isSmallScreen } from "util/generalUtil";
import OptionalPlantSearchFields from "./OptionalPlantSearchFields";
import PlantLocationField from "./PlantLocationField";

const PlantSearchForm = ({
  asSidebar,
  className,
  onClickSearch,
}: {
  asSidebar?: boolean;
  className?: string;
  onClickSearch: () => void;
}) => {
  const {
    hasCurrentResults,
    searchStatus,

    searchParams,
    searchParamsDraft,
    applySearchParams,

    showSearchForm,
    setShowSearchForm,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);
  const [activeTab, setActiveTab] = useState<"location" | "filters">(
    "location",
  );

  const paramsAreApplied = _.isEqual(searchParamsDraft, searchParams);

  const disableSubmit =
    locationPending || !searchParamsDraft || paramsAreApplied;

  const submitLocation = (e: FormEvent) => {
    e.preventDefault();
    if (!disableSubmit) {
      applySearchParams();
    }
  };

  const asModal = asSidebar && isSmallScreen();

  const searchForm = (
    <form onSubmit={submitLocation} className="flex flex-col gap-4">
      <PlantLocationField setLocationPending={setLocationPending} />
      {asModal && <div className="w-full border-t border-default" />}
      <OptionalPlantSearchFields />

      {(hasCurrentResults || searchParamsDraft) && (
        <Button
          className={classNames({ "sticky bottom-0": asModal })}
          disableOnLoading={false}
          disabled={disableSubmit}
          isLoading={paramsAreApplied && searchStatus !== "READY"}
          type="submit"
          variant="primary"
          onClick={onClickSearch}
        >
          Search
        </Button>
      )}
    </form>
  );

  return asModal ? (
    <Modal
      stickyHeader
      title="Plant Search Parameters"
      isOpen={showSearchForm}
      onClose={() => setShowSearchForm(false)}
      className="[&_.card]:p-1 [&_.card]:shadow-none [&_form]:pr-0 [&_form]:overflow-visible [&_form]:space-y-4"
    >
      {searchForm}
    </Modal>
  ) : asSidebar ? (
    <Sidebar
      isExpanded={showSearchForm}
      setIsExpanded={setShowSearchForm}
      externalCollapseButton
      className={(isExpanded) =>
        classNames({
          "sticky top-header-2 h-dvh-header-2 border-r": hasCurrentResults,
          "h-max": !hasCurrentResults,

          "w-md [&_.sidebar-button]:bg-accent [&_.sidebar-button]:dark:bg-primary-dark":
            isExpanded,
          "overflow-hidden": !isExpanded,
        })
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "w-md h-full flex flex-col gap-4 p-4 transition-opacity",
            hasCurrentResults && {
              "opacity-100 delay-150": isExpanded,
              "opacity-0": !isExpanded,
            },
          )}
        >
          <div className="flex gap-4 items-center justify-center">
            <Button
              variant="text"
              size="flush"
              onClick={() => setActiveTab("location")}
            >
              Location
            </Button>
            <Button
              variant="text"
              size="flush"
              onClick={() => setActiveTab("filters")}
            >
              Filters
            </Button>
          </div>
          <div className="pr-4 overflow-auto">
            {activeTab === "location" ? (
              searchForm
            ) : (
              <PlantFilters title={<h2>Plant filters</h2>} />
            )}
          </div>
        </div>
      )}
    </Sidebar>
  ) : (
    <div className={className}>{searchForm}</div>
  );
};

export default PlantSearchForm;
