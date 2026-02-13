import { getRouteApi } from "@tanstack/react-router";
import SearchRecordCard from "components/SearchRecordCard";
import FloatingHeader from "designSystem/FloatingHeader";
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
  const {
    page = 1,
    pageSize = ARCHIVE_PAGE_SIZE_OPTIONS[1],
    lastOpened,
  } = route.useSearch();
  const ScrollAnchor = useScrollAnchor();

  const {
    data: { allSearchRecords } = {},
    previousData,
    ...allSearchRecordsQuery
  } = useApolloQuery(GET_ALL_SEARCH_RECORDS, {
    variables: { offset: (page - 1) * pageSize, limit: pageSize },
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
      <FloatingHeader
        id="test-header"
        className="-mx-6 px-6 flex gap-2 items-center justify-between"
      >
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

      {allSearchRecords?.results.map((searchRecord) => (
        <SearchRecordCard key={searchRecord._id} {...searchRecord} />
      ))}
    </main>
  );
};

export default SearchArchive;
