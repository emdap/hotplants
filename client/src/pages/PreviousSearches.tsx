import SearchRecordCard from "components/SearchRecordCard";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { GET_ALL_SEARCH_RECORDS } from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";

const PreviousSearches = () => {
  const { data: { allSearchRecords } = {}, ...allSearchRecordsQuery } =
    useApolloQuery(GET_ALL_SEARCH_RECORDS);

  return (
    <main className="page-wrapper">
      <PageTitle>Previous Searches</PageTitle>
      <LoadingOverlay
        debounceShow
        show={allSearchRecordsQuery.loading}
        className="absolute w-1/2 h-80 animate-pulse"
      />

      {allSearchRecords && (
        <div>
          {allSearchRecords.count}
          <div className="flex flex-col lg:grid grid-cols-[repeat(auto-fit,_minmax(400px,1fr))] gap-4">
            {allSearchRecords.results.map((searchRecord, index) => (
              <SearchRecordCard key={index} searchRecord={searchRecord} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default PreviousSearches;
