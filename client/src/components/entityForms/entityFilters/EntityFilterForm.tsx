import { useNavigate, useSearch } from "@tanstack/react-router";
import classNames from "classnames";
import FilterInput from "components/dataControls/FilterInputField";
import { getOrderedFilterEntries } from "components/dataControls/filterUtil";
import EntityFormFooter from "components/entityForms/EntityFormFooter";
import StyledEntityForm from "components/entityForms/StyledEntityForm";
import { hotplantsClient } from "config/hotplantsConfig";
import { useEntitySelectionContext } from "contexts/entitySelection/EntitySelectionContext";
import Card from "designSystem/Card";
import Modal from "designSystem/Modal";
import StyledPopover from "designSystem/StyledPopover";
import { useReactQuery } from "hooks/useQuery";
import { isEqual } from "lodash";
import pluralize from "pluralize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import { isSmallScreen } from "util/generalUtil";
import { EntityFormProps, getFormTitle } from "../entityFormUtil";
import EntityFilterOpenButton from "./EntityFilterOpenButton";
import {
  constructDynamicFilters,
  ENTITY_NAME_FILTER_DICT,
  PLANT_STATIC_FILTER_DICT,
} from "./entityFilterUtil";

const EntityFilterForm = ({
  renderMode: renderModeProp,
  onClose,

  onOpenPopover,
  popoverIsOpen,
}: EntityFormProps & {
  onOpenPopover?: () => void;
  popoverIsOpen?: boolean;
}) => {
  const navigate = useNavigate();

  const { entityType, entityListLoading, totalItems } =
    useEntitySelectionContext();
  const { filter } = useSearch({ strict: false });
  const [filterDraft, setFilterDraft] = useState(filter);

  useEffect(() => {
    setFilterDraft(filter);
  }, [filter]);

  const submitFilter = useCallback(() => {
    {
      const filterHasData = Boolean(
        filterDraft &&
        Object.values(filterDraft).filter((val) => val !== undefined).length,
      );

      navigate({
        to: ".",
        search: ({ filter: _prevFilter, ...prev }) => ({
          ...prev,
          ...(filterHasData && { page: 1, filter: filterDraft }),
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
      search: ({ filter: _prevFilter, ...prev }) => prev,
      replace: true,
    });
  };

  const plantFilterValuesQuery = useReactQuery({
    queryKey: ["plant-filter-values"],
    enabled: entityType === "plant",
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
    if (entityType === "animal") {
      return getOrderedFilterEntries(ENTITY_NAME_FILTER_DICT);
    }

    const dynamicFilters =
      (plantFilterValuesQuery.data &&
        constructDynamicFilters(plantFilterValuesQuery.data)) ??
      {};

    return getOrderedFilterEntries({
      ...dynamicFilters,
      ...PLANT_STATIC_FILTER_DICT,
    });
  }, [plantFilterValuesQuery.data, entityType]);

  const renderMode =
    renderModeProp === "popover" && isSmallScreen() ? "modal" : renderModeProp;

  const formTitle = getFormTitle("filters", entityType);

  const formFooter = (
    <EntityFormFooter
      submitButtonProps={
        renderMode === "modal"
          ? {
              onClick: onClose,
              isLoading: entityListLoading || !isEqual(filterDraft, filter),
              children: (
                <span className="flex gap-1 relative ">
                  View {pluralize(entityType, totalItems, true)}
                </span>
              ),
            }
          : undefined
      }
      clearButtonProps={{
        disabled: !filter,
        onClick: clearFilter,
        children: "Clear",
      }}
    />
  );

  const formBody = (
    <div
      className={classNames("grow flex flex-col gap-4", {
        "max-h-full overflow-hidden": renderMode !== "card",
      })}
    >
      {renderMode === "card" ? (
        <h2 className="text-center">{formTitle}</h2>
      ) : (
        renderMode === "popover" && (
          <h4 className="font-semibold">{formTitle}</h4>
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
                value={filterDraft?.[dataKey as keyof typeof filterDraft]}
                highlightFilledFields
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
    <StyledEntityForm onSubmit={submitFilter}>
      {formBody}
      {formFooter}
    </StyledEntityForm>
  );

  return renderMode === "popover" ? (
    <StyledPopover
      anchor="bottom start"
      className="max-h-3/5! max-w-3/4! flex flex-col"
      button={<EntityFilterOpenButton />}
    >
      {formWrappedBody}
    </StyledPopover>
  ) : renderModeProp === "popover" && renderMode === "modal" ? (
    <>
      <Modal title={formTitle} onClose={onClose} isOpen={popoverIsOpen}>
        {formWrappedBody}
      </Modal>
      <EntityFilterOpenButton onClick={onOpenPopover} />
    </>
  ) : renderMode === "card" ? (
    <StyledEntityForm onSubmit={submitFilter}>
      <Card className="overflow-auto">{formBody}</Card>
      {formFooter}
    </StyledEntityForm>
  ) : (
    formWrappedBody
  );
};

export default EntityFilterForm;
