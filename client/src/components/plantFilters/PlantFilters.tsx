import { useNavigate, useSearch } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import Modal from "designSystem/Modal";
import StyledPopover from "designSystem/StyledPopover";
import FilterButton from "designSystem/iconButtons/FilterButton";
import { hotplantsClient } from "hooks/usePlantSearchQueries";
import { useReactQuery } from "hooks/useQuery";
import { ReactNode, useMemo, useState } from "react";
import { toast } from "sonner";
import { PlantDataFilter } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";
import FilterInputField from "./FilterInputField";
import {
  constructDynamicFilters,
  getSortedFilterEntries,
  STATIC_FILTER_DICT,
} from "./plantFilterUtil";

const PlantFilters = ({
  title,
  asPopover,
  className,
}: {
  title?: ReactNode;
  asPopover?: boolean;
  className?: string;
}) => {
  const navigate = useNavigate();
  const { plantListLoading, totalItems } = usePlantSelectionContext();
  const { plantFilter } = useSearch({ strict: false });
  const [showModal, setShowModal] = useState(false);

  const clearFilter = () =>
    navigate({
      to: ".",
      search: ({ plantFilter: _prevFilter, ...prev }) => prev,
    });

  const applyFilter = (newFilter?: PlantDataFilter) => {
    {
      const filterHasData = Boolean(
        newFilter &&
        Object.values(newFilter).filter((val) => val !== undefined).length,
      );

      navigate({
        to: ".",
        search: ({ plantFilter: _prevFilter, ...prev }) => ({
          ...prev,
          ...(filterHasData && { page: 1, plantFilter: newFilter }),
        }),
        replace: true,
      });
    }
  };

  const filterValuesQuery = useReactQuery({
    queryKey: ["plant-filters"],
    refetchOnWindowFocus: false,
    initialData: {},
    queryFn: async () => {
      try {
        const { data } = await hotplantsClient.GET("/plants/filterValues");
        return data ?? {};
      } catch (error) {
        console.error(error);
        toast.error("Error getting possible filter values from server.");
      }
    },
  });

  const sortedFilters = useMemo(() => {
    const dynamicFilters =
      (filterValuesQuery.data &&
        constructDynamicFilters(filterValuesQuery.data)) ??
      {};

    return getSortedFilterEntries({ ...dynamicFilters, ...STATIC_FILTER_DICT });
  }, [filterValuesQuery.data]);

  const filterActive = Boolean(plantFilter);
  const asModal = asPopover && isSmallScreen();

  const openFilterButton = (
    <FilterButton
      active={filterActive}
      className={classNames("m-0! lg:py-0.5 w-fit", className)}
      onClick={() => asModal && setShowModal(true)}
    >
      <span className="max-lg:hidden">Filters</span>
    </FilterButton>
  );

  const filterFooter = (
    <div
      className={classNames("flex gap-2", { "sticky bottom-0": filterActive })}
    >
      {showModal && (
        <Button className="grow" onClick={() => setShowModal(false)}>
          View plants
        </Button>
      )}
      <Button
        variant={showModal ? "secondary" : "primary"}
        className="grow"
        onClick={clearFilter}
        disabled={!filterActive}
      >
        Clear {!showModal && "filters"}
      </Button>
    </div>
  );

  const filterBody = (
    <div className="grow space-y-4 pt-2 pr-2 overflow-auto">
      {title ?? (!asModal && <h4 className="font-semibold">Filter plants</h4>)}
      {sortedFilters.map(([plantDataKey, filterInput]) => {
        return (
          filterInput && (
            <FilterInputField
              key={plantDataKey}
              filterInput={filterInput}
              value={plantFilter?.[plantDataKey]}
              onChange={(value) =>
                applyFilter({ ...plantFilter, [plantDataKey]: value })
              }
            />
          )
        );
      })}
    </div>
  );

  const containerClassName = "flex flex-col gap-2 pt-2";

  return asModal ? (
    <>
      <Modal
        title="Filter plants"
        subTitle={
          <Button
            variant="text"
            size="flush"
            onClick={() => setShowModal(false)}
          >
            <ItemCountWithLoader
              label="plant"
              count={totalItems}
              isLoading={plantListLoading}
            />
          </Button>
        }
        isOpen={showModal}
        stickyHeader
        onClose={() => setShowModal(false)}
        className={containerClassName}
      >
        {filterBody}
        {filterFooter}
      </Modal>
      {openFilterButton}
    </>
  ) : asPopover ? (
    <StyledPopover
      anchor="bottom start"
      className={classNames(
        "h-dvh-header-8 min-h-[400px] z-50",
        containerClassName,
      )}
      button={openFilterButton}
    >
      {filterBody}
      {filterFooter}
    </StyledPopover>
  ) : (
    <>
      <Card className={containerClassName}>{filterBody}</Card>
      {filterFooter}
    </>
  );
};

export default PlantFilters;
