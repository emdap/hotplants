import FilterInput from "components/dataControls/FilterInputField";
import { getOrderedFilterEntries } from "components/dataControls/filterUtil";
import { useIsSignedIn } from "config/authClient";
import FilterButton from "designSystem/iconButtons/FilterButton";
import StyledPopover from "designSystem/StyledPopover";
import { useCallback, useEffect, useMemo } from "react";
import { SearchHistoryParams } from "util/routeParamsUtil";
import {
  POPOVER_LABELS,
  SEARCH_HISTORY_FILTER_DICT,
  SearchHistoryPopoverProps,
  USER_SEARCH_HISTORY_FILTER,
} from "../searchHistoryDataUtil";
import SearchHistoryPopoverContentWrapper from "./SearchHistoryPopoverContentWrapper";

const SearchHistoryFilterPopover = ({
  currentParams,
  applyParams,
}: SearchHistoryPopoverProps) => {
  const isSignedIn = useIsSignedIn();

  const applyFilter = useCallback(
    (params: SearchHistoryParams["filter"]) => applyParams({ filter: params }),
    [applyParams],
  );

  useEffect(() => {
    isSignedIn && applyFilter({ userSearch: true });
  }, [applyFilter, isSignedIn]);

  const searchHistoryFilters = useMemo(
    () =>
      getOrderedFilterEntries({
        ...SEARCH_HISTORY_FILTER_DICT,
        ...(isSignedIn && { userSearch: USER_SEARCH_HISTORY_FILTER }),
      }),
    [isSignedIn],
  );

  const currentFilter = currentParams?.filter;
  const hasData = Boolean(currentFilter);

  return (
    <StyledPopover
      anchor="bottom start"
      button={
        <FilterButton size="small" active={hasData}>
          <span>{POPOVER_LABELS.filter}</span>
        </FilterButton>
      }
    >
      {({ close }) => (
        <SearchHistoryPopoverContentWrapper
          paramType="filter"
          {...{ hasData, applyParams, close }}
        >
          {searchHistoryFilters.map(
            ([field, filterInput]) =>
              filterInput && (
                <FilterInput
                  key={field}
                  className="grid grid-cols-[1fr_1.5fr] items-center"
                  filterInput={filterInput}
                  value={currentFilter?.[field] ?? null}
                  onChange={(nextValue) =>
                    applyFilter({
                      [field]: nextValue,
                    })
                  }
                />
              ),
          )}
        </SearchHistoryPopoverContentWrapper>
      )}
    </StyledPopover>
  );
};

export default SearchHistoryFilterPopover;
