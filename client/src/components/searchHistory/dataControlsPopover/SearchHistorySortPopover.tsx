import SortInputs from "components/dataControls/SortInputs";
import StyledPopover from "designSystem/StyledPopover";
import SortButton from "designSystem/iconButtons/SortButton";
import { isEqual } from "lodash";
import {
  DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS,
  SearchHistoryParams,
} from "util/routeParamsUtil";
import {
  POPOVER_LABELS,
  SEARCH_RECORD_SORT_LIST,
  SearchHistoryPopoverProps,
} from "../searchHistoryDataUtil";
import SearchHistoryPopoverContentWrapper from "./SearchHistoryPopoverContentWrapper";

const SearchHistorySortPopover = ({
  currentParams,
  applyParams,
}: SearchHistoryPopoverProps) => {
  const applySort = (params: SearchHistoryParams["sort"]) =>
    applyParams({ sort: params });

  const currentSort = currentParams?.sort;
  const hasData = !isEqual(
    currentSort,
    DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS.sort,
  );

  return (
    <StyledPopover
      anchor="bottom start"
      button={
        <SortButton size="small" active={hasData}>
          <span>{POPOVER_LABELS.sort}</span>
        </SortButton>
      }
    >
      {({ close }) => (
        <SearchHistoryPopoverContentWrapper
          paramType="sort"
          {...{ hasData, applyParams, close }}
        >
          <SortInputs
            sortFields={SEARCH_RECORD_SORT_LIST}
            multiSort
            {...{ applySort, currentSort }}
          />
        </SearchHistoryPopoverContentWrapper>
      )}
    </StyledPopover>
  );
};

export default SearchHistorySortPopover;
