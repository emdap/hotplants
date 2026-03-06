import classNames from "classnames";
import ClearPlantFiltersButton from "components/plantFilters/ClearPlantFiltersButton";
import PlantFiltersBody from "components/plantFilters/PlantFiltersBody";
import PlantFiltersModal from "components/plantFilters/PlantFiltersModal";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import Modal from "designSystem/Modal";
import Sidebar from "designSystem/Sidebar";
import { isSmallScreen } from "util/generalUtil";
import LocationSearchForm from "./LocationSearchForm";

const PlantSearchForm = ({
  asSidebar,
  className,
}: {
  asSidebar?: boolean;
  className?: string;
}) => {
  const {
    hasCurrentResults,
    searchFormState: { tab, isOpen },
    setSearchFormState,
  } = usePlantSearchContext();

  const asModal = asSidebar && isSmallScreen();

  const toggleIsOpen = (isOpen: boolean) =>
    setSearchFormState((prev) => ({ ...prev, isOpen }));

  return asModal ? (
    <>
      <Modal
        title="Location Parameters"
        isOpen={isOpen && tab === "location"}
        onClose={() => toggleIsOpen(false)}
        className="[&_.card]:p-1 [&_.card]:shadow-none [&_.card]:border-none"
      >
        <LocationSearchForm showSeparator={asModal} />
      </Modal>

      <PlantFiltersModal
        isOpen={isOpen && tab === "filters"}
        onClose={() => toggleIsOpen(false)}
      />
    </>
  ) : asSidebar ? (
    <Sidebar
      isExpanded={isOpen}
      setIsExpanded={toggleIsOpen}
      externalCollapseButton
      className={(isExpanded) =>
        classNames({
          "sticky top-header-2 h-dvh-header-2 border-r": hasCurrentResults,
          "h-max": !hasCurrentResults,

          "w-md [&_.sidebar-button]:bg-accent": isExpanded,
          "overflow-hidden": !isExpanded,
        })
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "w-md h-full flex flex-col gap-4 p-4 pr-5 transition-opacity",
            hasCurrentResults && {
              "opacity-100 delay-150": isExpanded,
              "opacity-0": !isExpanded,
            },
          )}
        >
          {tab === "location" ? (
            <LocationSearchForm />
          ) : (
            <div className="flex flex-col min-h-[400px] gap-2 pr-2">
              <Card className="overflow-auto">
                <PlantFiltersBody title={<h2>Plant filters</h2>} />
              </Card>
              <ClearPlantFiltersButton />
            </div>
          )}
        </div>
      )}
    </Sidebar>
  ) : (
    <div className={className}>
      <LocationSearchForm />
    </div>
  );
};

export default PlantSearchForm;
