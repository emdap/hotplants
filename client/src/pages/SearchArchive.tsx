import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/plantSearch/PlantAnimation";
import SearchRecordCard from "components/searchRecord/SearchRecordCard";
import SearchArchiveQueryPopover from "components/searchRecord/SearchRecordParamPopover";
import {
  parseFilterParams,
  SearchRecordQueryInput,
} from "components/searchRecord/searchRecordQueryUtil";
import FloatingHeader from "designSystem/FloatingHeader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import pluralize from "pluralize";
import { useLayoutEffect, useMemo } from "react";
import { useMount } from "react-use";

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
  });

  useLayoutEffect(() => {
    if (allSearchRecords && lastOpened) {
      document
        .getElementById(lastOpened)
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [lastOpened, allSearchRecords]);

  useMount(() => previousData && allSearchRecordsQuery.refetch());

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  return (
    <main className="page-buffer pb-10 flex flex-col gap-4">
      <PageTitle>Search Archive</PageTitle>

      <ScrollAnchor className="scroll-m-header -mb-4" />
      <FloatingHeader className="grid-centered small-screen:-mx-2.5 big-screen:-mx-6 big-screen:px-6 gap-2 items-center justify-between">
        <div className="flex items-center gap-1">
          {(["filter", "sort"] as const).map((param) => (
            <SearchArchiveQueryPopover
              key={param}
              paramType={param}
              currentParams={queryParams[param] as SearchRecordQueryInput[]}
              applyParams={(data) =>
                navigate({
                  to: ".",
                  search: { page: 1, [param]: data },
                  replace: true,
                })
              }
              clearParams={() =>
                navigate({
                  to: ".",
                  search: { page: 1, [param]: undefined },
                  replace: true,
                })
              }
            />
          ))}
        </div>

        {pluralize("Search", searchRecordCount, true)}
        <PaginationControl
          className="ml-auto"
          totalResults={searchRecordCount}
          pageSizeOptions={ARCHIVE_PAGE_SIZE_OPTIONS}
          replaceUrl
          {...{ page, pageSize }}
        />
      </FloatingHeader>

      <LoadingOverlay
        debounceShow={!previousData}
        transparent
        show={allSearchRecordsQuery.loading}
        className="h-screen animate-pulse opacity-50"
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
