import LoadingIcon from "components/designSystem/LoadingIcon";
import PlantAnimation from "components/PlantAnimation";
import { usePlantSearchContext } from "contexts/PlantSearchContext";

const PlantResultsFooter = () => {
  const {
    hasCurrentResults,
    hasNextPage,
    searchStatus,
    searchRecordQuery: { dataUpdatedAt },
  } = usePlantSearchContext();
  return hasNextPage && searchStatus !== "CHECKING_STATUS" ? (
    <LoadingIcon
      key="loading-icon"
      size={25}
      containerClassName="text-white mx-auto mt-auto pb-4"
    />
  ) : (
    <PlantAnimation
      key="plant-animation"
      queryStatus={searchStatus}
      isInitialSearch={!dataUpdatedAt}
      hasCurrentResults={hasCurrentResults}
    />
  );
};

export default PlantResultsFooter;
