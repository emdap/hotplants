import { getRouteApi } from "@tanstack/react-router";
import SearchRecordCard from "components/SearchRecordCard";
import FloatingHeader from "designSystem/FloatingHeader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/PaginationControl";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { AnimatePresence } from "motion/react";
import pluralize from "pluralize";
import { useLayoutEffect } from "react";

const route = getRouteApi("/archive");

const ARCHIVE_PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const SearchArchive = () => {
  const {
    page = 1,
    pageSize = ARCHIVE_PAGE_SIZE_OPTIONS[1],
    lastOpened,
  } = route.useSearch();

  const {
    data: { allSearchRecords } = {},
    previousData,
    ...allSearchRecordsQuery
  } = useApolloQuery(GET_ALL_SEARCH_RECORDS, {
    variables: { offset: (page - 1) * pageSize, limit: pageSize },
    fetchPolicy: "no-cache",
  });

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  useLayoutEffect(() => {
    if (allSearchRecords && lastOpened) {
      document
        .getElementById(lastOpened)
        ?.scrollIntoView({ behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSearchRecords]);

  return (
    <main className="page-buffer pb-10 space-y-4">
      <PageTitle>Search Archive</PageTitle>
      <LoadingOverlay
        debounceShow
        transparent
        show={allSearchRecordsQuery.loading}
        className="absolute w-1/2 h-80 animate-pulse"
      />
      <FloatingHeader className="-mx-2 flex gap-2">
        {pluralize("Search", searchRecordCount, true)}
        <PaginationControl
          className="ml-auto"
          totalResults={searchRecordCount}
          pageSizeOptions={ARCHIVE_PAGE_SIZE_OPTIONS}
          {...{ page, pageSize }}
        />
      </FloatingHeader>

      <AnimatePresence>
        {allSearchRecords?.results.map((searchRecord) => (
          <SearchRecordCard
            key={searchRecord._id}
            isActiveRecord={lastOpened === searchRecord._id}
            {...searchRecord}
          />
        ))}
      </AnimatePresence>
    </main>
  );
};

export default SearchArchive;
