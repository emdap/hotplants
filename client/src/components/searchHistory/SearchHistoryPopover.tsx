import FilterInput from "components/dataControls/FilterInputField";
import SortInputs from "components/dataControls/SortInputs";
import { getOrderedFilterEntries } from "components/dataControls/filterUtil";
import { useIsSignedIn } from "config/authClient";
import StyledPopover from "designSystem/StyledPopover";
import FilterButton from "designSystem/iconButtons/FilterButton";
import SortButton from "designSystem/iconButtons/SortButton";
import { isEqual } from "lodash";
import { ReactNode, useMemo } from "react";
import {
  DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS,
  SearchHistoryParams,
  SearchRecordFilter,
} from "util/routeParamsUtil";
import {
  SEARCH_HISTORY_FILTER_DICT,
  SEARCH_RECORD_SORT_LIST,
  SearchHistoryParamType,
  USER_SEARCH_HISTORY_FILTER,
} from "./searchHistoryDataUtil";

const POPOVER_BUTTON = {
  filter: FilterButton,
  sort: SortButton,
};

const POPOVER_LABELS = {
  filter: "Filter",
  sort: "Sort",
};

type ApplyParamsFn<T extends SearchHistoryParamType> = (
  params?: SearchHistoryParams[T],
) => void;

type SearchHistoryPopoverProps<T extends SearchHistoryParamType> = {
  paramKey: T;
  currentParams?: SearchHistoryParams[T];
  applyParams: ApplyParamsFn<T>;
  resetButton: (props: { disabled: boolean; close: () => void }) => ReactNode;
};

const SearchHistoryPopover = <T extends SearchHistoryParamType>({
  paramKey,
  currentParams,
  applyParams,
  resetButton,
}: SearchHistoryPopoverProps<T>) => {
  const isSignedIn = useIsSignedIn();

  // Typesafe castings

  const searchHistoryFilters = useMemo(
    () =>
      getOrderedFilterEntries({
        ...SEARCH_HISTORY_FILTER_DICT,
        ...(isSignedIn && { userSearch: USER_SEARCH_HISTORY_FILTER }),
      }),
    [isSignedIn],
  );

  const { hasData, currentFilterParams, applyFilter } = useMemo(
    () =>
      paramKey === "sort"
        ? {
            hasData: !isEqual(
              currentParams,
              DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS.sort,
            ),
            currentFilterParams: undefined,
            applyFilter: undefined,
          }
        : {
            hasData: Boolean(currentParams),
            currentFilterParams: currentParams as SearchRecordFilter,
            applyFilter: applyParams as ApplyParamsFn<"filter">,
          },
    [paramKey, currentParams, applyParams],
  );

  const PopoverButton = POPOVER_BUTTON[paramKey as SearchHistoryParamType];

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
              <SortInputs
                sortFields={SEARCH_RECORD_SORT_LIST}
                currentSort={currentParams as SearchHistoryParams["sort"]}
                multiSort
                applySort={applyParams}
              />
            ) : (
              searchHistoryFilters.map(([field, filterInput]) => {
                if (filterInput) {
                  return (
                    <FilterInput
                      key={field}
                      className="grid grid-cols-[1fr_1.5fr] items-center"
                      filterInput={filterInput}
                      value={currentFilterParams?.[field] ?? null}
                      onChange={(nextValue) =>
                        applyFilter &&
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

export default SearchHistoryPopover;
