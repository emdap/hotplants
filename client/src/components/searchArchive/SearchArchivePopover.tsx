import FilterInputField from "components/dataControls/FilterInputField";
import SortInputFields from "components/dataControls/SortInputFields";
import StyledPopover from "designSystem/StyledPopover";
import FilterButton from "designSystem/iconButtons/FilterButton";
import SortButton from "designSystem/iconButtons/SortButton";
import { ReactNode } from "react";
import { SearchArchiveParams, SearchRecordFilter } from "util/routeParamsUtil";
import {
  ORDERED_SEARCH_RECORD_FILTERS,
  SEARCH_RECORD_SORT_LIST,
  SearchArchiveParamType,
} from "./searchRecordParamUtil";

const POPOVER_BUTTON = {
  filter: FilterButton,
  sort: SortButton,
};

const POPOVER_LABELS = {
  filter: "Filter",
  sort: "Sort",
};

type ApplyParamsFn<T extends SearchArchiveParamType> = (
  params?: SearchArchiveParams[T],
) => void;

type SearchArchivePopoverProps<T extends SearchArchiveParamType> = {
  paramKey: T;
  currentParams?: SearchArchiveParams[T];
  applyParams: ApplyParamsFn<T>;
  resetButton: (props: { disabled: boolean; close: () => void }) => ReactNode;
};

const SearchArchivePopover = <T extends SearchArchiveParamType>({
  paramKey,
  currentParams,
  applyParams,
  resetButton,
}: SearchArchivePopoverProps<T>) => {
  const PopoverButton = POPOVER_BUTTON[paramKey as SearchArchiveParamType];
  const hasData = Boolean(
    Array.isArray(currentParams) ? currentParams.length : currentParams,
  );

  return (
    <StyledPopover
      anchor="bottom start"
      className="flex flex-col border-accent/20 dark:border max-h-[60vh]! gap-3 overflow-hidden"
      button={
        <PopoverButton size="small" active={hasData}>
          <span className="max-lg:hidden text-sm">
            {POPOVER_LABELS[paramKey]}
          </span>
        </PopoverButton>
      }
    >
      {({ close }) => (
        <>
          <h4 className="font-semibold">{POPOVER_LABELS[paramKey]} results</h4>
          <div className="grow space-y-2 overflow-auto">
            {paramKey === "sort" ? (
              <SortInputFields
                sortFields={SEARCH_RECORD_SORT_LIST}
                currentSort={currentParams as SearchArchiveParams["sort"]}
                className="grid grid-cols-[1fr_auto] items-center"
                applySort={applyParams}
              />
            ) : (
              ORDERED_SEARCH_RECORD_FILTERS.map(([field, filterInput]) => {
                if (filterInput) {
                  // Typesafe castings
                  const filterParamValue = (
                    currentParams as SearchRecordFilter | undefined
                  )?.[field];

                  const applyFilter = applyParams as ApplyParamsFn<"filter">;

                  return (
                    <FilterInputField
                      key={field}
                      className="grid grid-cols-[1fr_1.5fr] items-center"
                      filterInput={filterInput}
                      value={filterParamValue ?? null}
                      onChange={(nextValue) =>
                        applyFilter({
                          [field]: nextValue,
                        })
                      }
                    />
                  );
                }
              })
            )}
          </div>
          {resetButton({ disabled: !hasData, close })}
        </>
      )}
    </StyledPopover>
  );
};

export default SearchArchivePopover;
