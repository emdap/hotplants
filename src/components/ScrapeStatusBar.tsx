import Card from "designSystem/Card";
import { SearchRecordStatus } from "generated/graphql/graphql";

const ScrapeStatusBar = ({ status }: { status?: SearchRecordStatus }) => {
  return <Card> Scrape status: {status ?? "N/A"} </Card>;
};

export default ScrapeStatusBar;
