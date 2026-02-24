import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/plantSearch/PlantAnimation";
import SearchRecordCard from "components/searchRecord/SearchRecordCard";
import SearchArchiveQueryPopover from "components/searchRecord/SearchRecordParamPopover";
import {
  parseFilterParams,
  SearchRecordQueryInput,
} from "components/searchRecord/searchRecordQueryUtil";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect, useMemo } from "react";

const route = getRouteApi("/search-archive");

const ARCHIVE_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const SearchArchive = () => {
  const navigate = useNavigate();
  const {
    page = 1,
    pageSize = ARCHIVE_PAGE_SIZE_OPTIONS[1],
    lastOpened,
    ...queryParams
  } = route.useSearch();
  const ScrollAnchor = useScrollAnchor();

  const filterParams = useMemo(
    () => parseFilterParams(queryParams.filter),
    [queryParams.filter],
  );

  const {
    data: { allSearchRecords } = {},
    previousData,
    ...allSearchRecordsQuery
  } = useApolloQuery(GET_ALL_SEARCH_RECORDS, {
    variables: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
      sort: queryParams.sort,
      ...filterParams,
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

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  return (
    <main className="page-buffer page-container">
      <PageTitle>Search Archive</PageTitle>

      <ScrollAnchor className="scroll-m-header -mb-4" />
      <FloatingHeader>
        <div className="flex items-center gap-1">
          {(["filter", "sort"] as const).map((param) => (
            <SearchArchiveQueryPopover
              key={param}
              paramType={param}
              currentParams={queryParams[param] as SearchRecordQueryInput[]}
              applyParams={(data) =>
                navigate({
                  to: ".",
                  search: (prev) => ({ ...prev, page: 1, [param]: data }),
                  replace: true,
                })
              }
              clearParams={() =>
                navigate({
                  to: ".",
                  search: (prev) => ({ ...prev, page: 1, [param]: undefined }),
                  replace: true,
                })
              }
            />
          ))}
        </div>

        <ItemCountWithLoader
          label="Search"
          count={searchRecordCount}
          isLoading={!searchRecordCount && allSearchRecordsQuery.loading}
          replaceCountWithLoader
        />

        <PaginationControl
          className="ml-auto"
          pageSizeOptions={ARCHIVE_PAGE_SIZE_OPTIONS}
          totalItems={searchRecordCount}
          replaceUrl
          {...{ page, pageSize }}
        />
      </FloatingHeader>

      <LoadingOverlay
        transparent
        className="min-h-[80vh]!"
        debounceShow={!previousData}
        show={allSearchRecordsQuery.loading && !previousData}
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

export default SearchArchive;
