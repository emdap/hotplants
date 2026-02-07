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
import { useEffect, useLayoutEffect, useRef } from "react";
import { useMount, usePrevious } from "react-use";

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
  });

  const searchRecordCount =
    allSearchRecords?.count ?? previousData?.allSearchRecords.count ?? 0;

  useMount(() => previousData && allSearchRecordsQuery.refetch());

  useLayoutEffect(() => {
    if (allSearchRecords && lastOpened) {
      document
        .getElementById(lastOpened)
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [lastOpened, allSearchRecords]);

  const scrollOnData = useRef(false);
  const previousPage = usePrevious(page);
  useEffect(() => {
    if (page !== previousPage && !lastOpened) {
      scrollOnData.current = true;
    }
    if (scrollOnData.current && allSearchRecords?.results) {
      scrollOnData.current = false;
      const firstResult = allSearchRecords.results[0]._id;

      document
        .getElementById(firstResult)
        ?.scrollIntoView({ behavior: "instant" });
    }
  }, [page, previousPage, lastOpened, allSearchRecords?.results]);

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
          replaceUrl
          {...{ page, pageSize }}
        />
      </FloatingHeader>

      <AnimatePresence>
        {allSearchRecords?.results.map((searchRecord) => (
          <SearchRecordCard key={searchRecord._id} {...searchRecord} />
        ))}
      </AnimatePresence>
    </main>
  );
};

export default SearchArchive;
