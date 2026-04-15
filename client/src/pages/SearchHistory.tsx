import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import SearchRecordCard from "components/searchHistory/SearchRecordCard";
import SearchHistoryFilterPopover from "components/searchHistory/searchHistoryDataControls/SearchHistoryFilterPopover";
import SearchHistorySortPopover from "components/searchHistory/searchHistoryDataControls/SearchHistorySortPopover";
import { parseFilterParams } from "components/searchHistory/searchHistoryDataControls/searchHistoryDataUtil";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect } from "react";
import { SearchHistoryParams } from "util/routeParamsUtil";

const route = getRouteApi("/search-history");

const SEARCH_HISTORY_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const SEARCH_HISTORY_POPOVER = {
  filter: SearchHistoryFilterPopover,
  sort: SearchHistorySortPopover,
};

const SearchHistory = () => {
  const navigate = useNavigate();
  const {
    page = 1,
    pageSize = SEARCH_HISTORY_PAGE_SIZE_OPTIONS[1],
    lastOpened,
    ...queryParams
  } = route.useSearch();
  const ScrollAnchor = useScrollAnchor();

  const {
    data: { allSearchRecords } = {},
    previousData,
    ...allSearchRecordsQuery
  } = useApolloQuery(GET_ALL_SEARCH_RECORDS, {
    variables: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      sort: queryParams.sort,
      ...(queryParams.filter && parseFilterParams(queryParams.filter)),
    },
    fetchPolicy: "cache-and-network",
  });

  useLayoutEffect(() => {
    if (allSearchRecords && lastOpened) {
      document
        .getElementById(lastOpened)
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [lastOpened, allSearchRecords]);

  const applyParams = (params: SearchHistoryParams) =>
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, page: 1, ...params }),
      replace: true,
    });

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  return (
    <main className="page-buffer page-container">
      <PageTitle>Search History</PageTitle>
      <ScrollAnchor className="scroll-m-header -mb-4" />
      <FloatingHeader>
        <div className="flex items-center gap-2">
          {(["filter", "sort"] as const).map((paramType) => {
            const Component = SEARCH_HISTORY_POPOVER[paramType];
            return (
              <Component
                key={paramType}
                currentParams={queryParams}
                applyParams={applyParams}
              />
            );
          })}
        </div>

        <ItemCountWithLoader
          label="Search"
          count={searchRecordCount}
          isLoading={!searchRecordCount && allSearchRecordsQuery.loading}
          replaceCountWithLoader
        />

        <PaginationControl
          className="ml-auto"
          pageSizeOptions={SEARCH_HISTORY_PAGE_SIZE_OPTIONS}
          totalItems={searchRecordCount}
          replaceUrl
          {...{ page, pageSize }}
        />
      </FloatingHeader>

      <LoadingOverlay
        transparent
        showServerStatus
        className="min-h-0! h-dvh-header-2"
        debounceShow={!previousData}
        show={
          allSearchRecordsQuery.loading &&
          allSearchRecordsQuery.dataState !== "complete"
        }
      />

      {allSearchRecords?.results.map((searchRecord, index) => (
        <SearchRecordCard key={searchRecord._id + index} {...searchRecord} />
      ))}
      {allSearchRecords?.count === 0 && (
        <PlantAnimation dataType="records" className="small-screen:mt-20" />
      )}
    </main>
  );
};

export default SearchHistory;
