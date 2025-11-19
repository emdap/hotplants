import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { PlantSearchQueryStatus } from "hooks/usePlantSearchQueries";
import { ReactNode } from "react";

const ScrapeStatusBar = ({
  plantQueryStatus,
  totalResultsCount,
  children,
}: {
  plantQueryStatus: PlantSearchQueryStatus;
  totalResultsCount?: number;
  children?: ReactNode;
}) => {
  const { plantSearchResults } = usePlantSearchContext();

  return (
    <Card className="flex items-center gap-4">
      <span>{plantQueryStatus !== "READY" && <LoadingIcon />}</span>
      {totalResultsCount && (
        <span>
          Viewing {plantSearchResults.length} results out of {totalResultsCount}
        </span>
      )}

      <div className="ml-auto">{children}</div>
    </Card>
  );
};

export default ScrapeStatusBar;
