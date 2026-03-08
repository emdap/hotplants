import Card from "designSystem/Card";
import ProgressBar from "designSystem/ProgressBar";
import { SearchRecordResult } from "graphqlHelpers/searchRecordQueries";
import { MdInfo } from "react-icons/md";

const SearchRecordProgressBar = ({
  occurrencesOffset,
  totalOccurrences,
  status,
  hideTitle,
  totalGraphQlResults,
}: Pick<
  SearchRecordResult,
  "occurrencesOffset" | "totalOccurrences" | "status"
> & { hideTitle?: boolean; totalGraphQlResults?: number }) => (
  <div className="flex flex-col gap-2 mt-auto w-full">
    <ProgressBar
      title={hideTitle ? undefined : "Scraping progress"}
      unitTitle="Plant occurrences analyzed"
      isLoading={status === "SCRAPING"}
      amount={occurrencesOffset}
      total={totalOccurrences}
      isError={status === "COMPLETE" && totalOccurrences === 0}
    />
    {totalGraphQlResults && totalGraphQlResults > totalOccurrences && (
      <Card solid className="bg-default-text/20! border-0 text-sm">
        <MdInfo className="inline text-base mb-0.5 mr-2" />
        There may be discrepancies between the "plant occurrences analyzed"
        count, and how many plants are actually returned. <br />
        <br /> This is due to different methodologies when finding a count of
        plant occurrences, versus retrieving plants from the database.
      </Card>
    )}
  </div>
);

export default SearchRecordProgressBar;
