import FilterInput from "components/dataControls/FilterInputField";
import { getOrderedFilterEntries } from "components/dataControls/filterUtil";
import { useIsSignedIn } from "config/authConfig";
import FilterButton from "designSystem/iconButtons/FilterButton";
import StyledPopover from "designSystem/StyledPopover";
import { useEffect, useMemo } from "react";
import { isSmallScreen } from "util/generalUtil";
import { SearchHistoryParams } from "util/routeParamsUtil";
import {
  POPOVER_LABELS,
  SEARCH_HISTORY_FILTER_DICT,
  SearchHistoryPopoverProps,
  USER_SEARCH_HISTORY_FILTER,
} from "./searchHistoryDataUtil";
import SearchHistoryPopoverContentWrapper from "./SearchHistoryPopoverContentWrapper";

const SearchHistoryFilterPopover = ({
  currentParams,
  applyParams,
}: SearchHistoryPopoverProps) => {
  const isSignedIn = useIsSignedIn();

  const currentFilter = currentParams?.recordFilter;
  const hasData = Boolean(currentFilter);

  const applyFilter = (params: SearchHistoryParams["recordFilter"]) =>
    applyParams({ recordFilter: { ...currentFilter, ...params } });

  useEffect(
    () => {
      isSignedIn && applyFilter({ userSearch: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSignedIn],
  );

  const searchHistoryFilters = useMemo(
    () =>
      getOrderedFilterEntries({
        ...SEARCH_HISTORY_FILTER_DICT,
        ...(isSignedIn && { userSearch: USER_SEARCH_HISTORY_FILTER }),
      }),
    [isSignedIn],
  );

  return (
    <StyledPopover
      anchor="bottom start"
      button={
        <FilterButton size="small" active={hasData}>
          <span>{POPOVER_LABELS.recordFilter}</span>
        </FilterButton>
      }
    >
      {({ close }) => (
        <SearchHistoryPopoverContentWrapper
          paramType="recordFilter"
          {...{ hasData, applyParams, close }}
        >
          {searchHistoryFilters.map(
            ([field, filterInput]) =>
              filterInput && (
                <FilterInput
                  key={field}
                  className="big-screen:grid big-screen:grid-cols-[1fr_200px] big-screen:items-center"
                  filterInput={{ ...filterInput, asFieldset: isSmallScreen() }}
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
