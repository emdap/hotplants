import Card from "designSystem/Card";
import { SearchRecord } from "helpers/customSchemaTypes";

const ScrapeStatusBar = ({ searchRecord }: { searchRecord?: SearchRecord }) => {
  return <Card>Scrape status: {searchRecord?.status ?? "N/A"}</Card>;
};

export default ScrapeStatusBar;
