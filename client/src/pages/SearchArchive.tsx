import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import SearchArchivePopover from "components/searchArchive/SearchArchivePopover";
import SearchRecordCard from "components/searchArchive/SearchRecordCard";
import {
  parseFilterParams,
  SearchArchiveParamType,
} from "components/searchArchive/searchRecordParamUtil";
import Button from "designSystem/Button";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect } from "react";
import { SearchArchiveParams } from "util/routeParamsUtil";

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

  const applyParams = <T extends SearchArchiveParamType>(
    paramKey: T,
    params?: SearchArchiveParams[T],
  ) =>
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, page: 1, [paramKey]: params }),
      replace: true,
    });

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  return (
    <main className="page-buffer page-container">
      <PageTitle>Search Archive</PageTitle>
      <ScrollAnchor className="scroll-m-header -mb-4" />
      <FloatingHeader>
        <div className="flex items-center gap-2">
          {(["filter", "sort"] as const).map((paramKey) => (
            <SearchArchivePopover
              key={paramKey}
              paramKey={paramKey}
              currentParams={queryParams[paramKey]}
              applyParams={(params) => applyParams(paramKey, params)}
              resetButton={({ disabled, close }) => (
                <Button
                  disabled={disabled}
                  variant="accent"
                  size="small"
                  onClick={() => {
                    applyParams(paramKey);
                    close();
                  }}
                >
                  Reset
                </Button>
              )}
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

export default SearchArchive;
