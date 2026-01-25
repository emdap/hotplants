import SearchRecordCard from "components/SearchRecordCard";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";

const SearchArchive = () => {
  const { data: { allSearchRecords } = {}, ...allSearchRecordsQuery } =
    useApolloQuery(GET_ALL_SEARCH_RECORDS, { fetchPolicy: "no-cache" });

  return (
    <main className="page-buffer pb-10">
      <PageTitle>Search Archive</PageTitle>
      <LoadingOverlay
        debounceShow
        show={allSearchRecordsQuery.loading}
        className="absolute w-1/2 h-80 animate-pulse"
      />

      {allSearchRecords && (
        <div className="flex flex-col max-w-page gap-4">
          {allSearchRecords.results.map((searchRecord, index) => (
            <SearchRecordCard key={index} {...searchRecord} />
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchArchive;
