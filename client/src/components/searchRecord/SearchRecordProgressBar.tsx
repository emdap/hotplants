import ProgressBar from "designSystem/ProgressBar";
import { SearchRecordResult } from "graphqlHelpers/searchRecordQueries";

const SearchRecordProgressBar = ({
  occurrencesOffset,
  totalOccurrences,
  status,
  hideTitle,
}: Pick<
  SearchRecordResult,
  "occurrencesOffset" | "totalOccurrences" | "status"
> & { hideTitle?: boolean }) => (
  <ProgressBar
    className="mt-auto w-full"
    title={hideTitle ? undefined : "Scraping progress"}
    unitTitle="Plant occurrences analyzed"
    isLoading={status === "SCRAPING"}
    amount={occurrencesOffset}
    total={totalOccurrences}
    isError={status === "COMPLETE" && totalOccurrences === 0}
  />
);

export default SearchRecordProgressBar;
