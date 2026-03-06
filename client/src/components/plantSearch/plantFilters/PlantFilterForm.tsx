import { useNavigate, useSearch } from "@tanstack/react-router";
import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Card from "designSystem/Card";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import Modal from "designSystem/Modal";
import StyledPopover from "designSystem/StyledPopover";
import { hotplantsClient } from "hooks/usePlantSearchQueries";
import { useReactQuery } from "hooks/useQuery";
import { useMemo } from "react";
import { toast } from "sonner";
import { PlantDataFilter } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";
import PlantSearchFormFooter from "../PlantSearchFormFooter";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "../plantSearchFormUtil";
import FilterInputField from "./FilterInputField";
import PlantFilterOpenButton from "./PlantFilterOpenButton";
import {
  constructDynamicFilters,
  getSortedFilterEntries,
  STATIC_FILTER_DICT,
} from "./plantFilterUtil";

const PlantFiltersForm = ({
  renderMode: renderModeProp,
  onClick,
  ...modalProps
}: PlantSearchFormProps) => {
  const navigate = useNavigate();
  const { plantFilter } = useSearch({ strict: false });
  const { plantListLoading, totalItems } = usePlantSelectionContext();

  const renderMode =
    renderModeProp === "popover" && isSmallScreen() ? "modal" : renderModeProp;

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

  const clearFilter = () =>
    navigate({
      to: ".",
      search: ({ plantFilter: _prevFilter, ...prev }) => prev,
      replace: true,
    });

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

  const plantFilterFooter = (
    <PlantSearchFormFooter
      submitButtonProps={
        renderMode === "modal"
          ? {
              onClick: modalProps?.onClose,
              className: "basis-1/2",
              children: (
                <span className="flex gap-1 relative">
                  View
                  <ItemCountWithLoader
                    label="plant"
                    count={totalItems}
                    isLoading={plantListLoading}
                    className="text-white! [&_svg]:absolute [&_svg]:-right-6"
                  />
                </span>
              ),
            }
          : undefined
      }
      clearButtonProps={{
        disabled: !plantFilter,
        onClick: clearFilter,
        children: "Reset filters",
      }}
    />
  );

  const plantFilterForm = (
    <div
      className={classNames("grow flex flex-col gap-4", {
        "mb-2 max-h-full overflow-hidden": renderMode !== "card",
      })}
    >
      {renderMode === "card" ? (
        <h2>{PLANT_FORM_TITLES.filters}</h2>
      ) : (
        renderMode === "popover" && (
          <h4 className="font-semibold">{PLANT_FORM_TITLES.filters}</h4>
        )
      )}

      <div
        className={classNames("space-y-4 pb-3", {
          "overflow-auto pr-4": renderMode !== "card",
          "-mt-2": renderMode === "popover",
          "pt-4": renderMode === "modal",
        })}
      >
        {sortedFilters.map(
          ([plantDataKey, filterInput]) =>
            filterInput && (
              <FilterInputField
                key={plantDataKey}
                filterInput={filterInput}
                value={plantFilter?.[plantDataKey]}
                onChange={(value) =>
                  applyFilter({ ...plantFilter, [plantDataKey]: value })
                }
              />
            ),
        )}
      </div>
    </div>
  );

  return renderMode === "card" ? (
    <>
      <Card className="overflow-auto">{plantFilterForm}</Card>
      {plantFilterFooter}
    </>
  ) : renderMode === "modal" ? (
    <>
      <Modal title={PLANT_FORM_TITLES["filters"]} {...modalProps}>
        {plantFilterForm}
        {plantFilterFooter}
      </Modal>

      {renderModeProp === "popover" && (
        <PlantFilterOpenButton onClick={onClick} />
      )}
    </>
  ) : (
    <StyledPopover
      anchor="bottom start"
      className="max-h-3/5! max-w-3/4! flex flex-col"
      button={<PlantFilterOpenButton />}
    >
      {plantFilterForm}
      {plantFilterFooter}
    </StyledPopover>
  );
};

export default PlantFiltersForm;
