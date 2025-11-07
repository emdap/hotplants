import Card from "designSystem/Card";
import { GetSearchRecordQuery } from "generated/graphql/graphql";

const ScrapeStatusBar = ({
  searchRecord,
}: {
  searchRecord?: GetSearchRecordQuery["searchRecord"];
}) => {
  return (
    <Card>
      Scrape status: {searchRecord?.status ?? "N/A"}; Count:{" "}
      {searchRecord?.totalOccurrences ?? "N/A"}{" "}
    </Card>
  );
};

export default ScrapeStatusBar;
