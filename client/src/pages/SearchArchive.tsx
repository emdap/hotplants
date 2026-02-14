import { getRouteApi, useNavigate } from "@tanstack/react-router";
import SearchArchiveSortPopover from "components/searchArchive/SearchArchiveSortPopover";
import SearchRecordCard from "components/searchArchive/SearchRecordCard";
import FloatingHeader from "designSystem/FloatingHeader";
import FilterButton from "designSystem/iconButtons/FilterButton";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import pluralize from "pluralize";
import { useLayoutEffect } from "react";
import { useMount } from "react-use";

const route = getRouteApi("/search-archive");

const ARCHIVE_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const SearchArchive = () => {
  const navigate = useNavigate();
  const {
    page = 1,
    pageSize = ARCHIVE_PAGE_SIZE_OPTIONS[1],
    lastOpened,
    sort,
  } = route.useSearch();
  const ScrollAnchor = useScrollAnchor();

  const {
    data: { allSearchRecords } = {},
    previousData,
    ...allSearchRecordsQuery
  } = useApolloQuery(GET_ALL_SEARCH_RECORDS, {
    variables: { offset: (page - 1) * pageSize, limit: pageSize, sort },
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
    <main className="page-buffer pb-10 space-y-4">
      <PageTitle>Search Archive</PageTitle>

      <ScrollAnchor className="scroll-m-header" />
      <FloatingHeader className="grid-centered small-screen:-mx-2 big-screen:-mx-6 big-screen:px-6 gap-2 items-center justify-between">
        <div className="flex items-center gap-1">
          <FilterButton active size="small" />
          <SearchArchiveSortPopover
            sort={sort}
            applySort={(sort) =>
              navigate({ to: ".", search: { page: 1, sort }, replace: true })
            }
            clearSort={() =>
              navigate({
                to: ".",
                search: { page: 1, sort: undefined },
                replace: true,
              })
            }
          />
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
    </main>
  );
};

export default SearchArchive;
