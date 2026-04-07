import { useNavigate, useSearch } from "@tanstack/react-router";
import classNames from "classnames";
import FilterInput from "components/dataControls/FilterInputField";
import { getOrderedFilterEntries } from "components/dataControls/filterUtil";
import PlantSearchFormFooter from "components/plantDataControls/PlantDataFormFooter";
import StyledPlantForm from "components/plantDataControls/StyledPlantForm";
import { hotplantsClient } from "config/hotplantsConfig";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Card from "designSystem/Card";
import Modal from "designSystem/Modal";
import StyledPopover from "designSystem/StyledPopover";
import { useReactQuery } from "hooks/useQuery";
import pluralize from "pluralize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import { isSmallScreen } from "util/generalUtil";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "../plantSearchFormUtil";
import PlantFilterOpenButton from "./PlantFilterOpenButton";
import { constructDynamicFilters, STATIC_FILTER_DICT } from "./plantFilterUtil";

const PlantFilterForm = ({
  renderMode: renderModeProp,
  onClose,

  onOpenPopover,
  popoverIsOpen,
}: PlantSearchFormProps & {
  onOpenPopover?: () => void;
  popoverIsOpen?: boolean;
}) => {
  const navigate = useNavigate();
  const { plantListLoading, totalItems } = usePlantSelectionContext();
  const { plantFilter } = useSearch({ strict: false });
  const [filterDraft, setFilterDraft] = useState(plantFilter);

  useEffect(() => {
    setFilterDraft(plantFilter);
  }, [plantFilter]);

  const submitFilter = useCallback(() => {
    {
      const filterHasData = Boolean(
        filterDraft &&
        Object.values(filterDraft).filter((val) => val !== undefined).length,
      );

      navigate({
        to: ".",
        search: ({ plantFilter: _prevFilter, ...prev }) => ({
          ...prev,
          ...(filterHasData && { page: 1, plantFilter: filterDraft }),
        }),
        replace: true,
      });
    }
  }, [navigate, filterDraft]);

  useDebounce(submitFilter, 500, [submitFilter]);

  const clearFilter = () => {
    setFilterDraft(undefined);

    navigate({
      to: ".",
      search: ({ plantFilter: _prevFilter, ...prev }) => prev,
      replace: true,
    });
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

  const orderedFilters = useMemo(() => {
    const dynamicFilters =
      (filterValuesQuery.data &&
        constructDynamicFilters(filterValuesQuery.data)) ??
      {};

    return getOrderedFilterEntries({
      ...dynamicFilters,
      ...STATIC_FILTER_DICT,
    });
  }, [filterValuesQuery.data]);

  const renderMode =
    renderModeProp === "popover" && isSmallScreen() ? "modal" : renderModeProp;

  const plantFilterFooter = (
    <PlantSearchFormFooter
      submitButtonProps={
        renderMode === "modal"
          ? {
              onClick: onClose,
              isLoading: plantListLoading,
              children: (
                <span className="flex gap-1 relative ">
                  View {pluralize("plant", totalItems, true)}
                </span>
              ),
            }
          : undefined
      }
      clearButtonProps={{
        disabled: !plantFilter,
        onClick: clearFilter,
        children: "Clear",
      }}
    />
  );

  const plantFilterForm = (
    <div
      className={classNames("grow flex flex-col gap-4", {
        "max-h-full overflow-hidden": renderMode !== "card",
      })}
    >
      {renderMode === "card" ? (
        <h2 className="text-center">{PLANT_FORM_TITLES.filters}</h2>
      ) : (
        renderMode === "popover" && (
          <h4 className="font-semibold">{PLANT_FORM_TITLES.filters}</h4>
        )
      )}

      <div
        className={classNames("space-y-4 pb-3", {
          "overflow-y-auto overflow-x-hidden pr-4": renderMode !== "card",
          "-mt-2": renderMode === "popover",
          "pt-4": renderMode === "modal",
        })}
      >
        {orderedFilters.map(
          ([dataKey, filterInput]) =>
            filterInput && (
              <FilterInput
                key={dataKey}
                filterInput={filterInput}
                value={filterDraft?.[dataKey]}
                onChange={(value) =>
                  setFilterDraft({ ...filterDraft, [dataKey]: value })
                }
              />
            ),
        )}
      </div>
    </div>
  );

  const formWrappedBody = (
    <StyledPlantForm onSubmit={submitFilter}>
      {plantFilterForm}
      {plantFilterFooter}
    </StyledPlantForm>
  );

  return renderMode === "popover" ? (
    <StyledPopover
      anchor="bottom start"
      className="max-h-3/5! max-w-3/4! flex flex-col"
      button={<PlantFilterOpenButton />}
    >
      {formWrappedBody}
    </StyledPopover>
  ) : renderModeProp === "popover" && renderMode === "modal" ? (
    <>
      <Modal
        title={PLANT_FORM_TITLES["plant-name"]}
        onClose={onClose}
        isOpen={popoverIsOpen}
      >
        {formWrappedBody}
      </Modal>
      <PlantFilterOpenButton onClick={onOpenPopover} />
    </>
  ) : renderMode === "card" ? (
    <StyledPlantForm onSubmit={submitFilter}>
      <Card className="overflow-auto">{plantFilterForm}</Card>
      {plantFilterFooter}
    </StyledPlantForm>
  ) : (
    formWrappedBody
  );
};

export default PlantFilterForm;
