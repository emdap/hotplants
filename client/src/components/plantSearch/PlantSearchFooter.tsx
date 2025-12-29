import PlantAnimation from "components/plantSearch/PlantAnimation";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";

const PlantSearchFooter = () => {
  const {
    hasCurrentResults,
    hasNextPage,
    searchStatus,
    searchRecordQuery: { dataUpdatedAt },
  } = usePlantSearchContext();
  return hasNextPage && searchStatus !== "CHECKING_STATUS" ? (
    <div className="pb-4 mx-auto -mt-10 mb-10">
      <LoadingIcon key="loading-icon" size={25} className="text-white" />
    </div>
  ) : (
    <PlantAnimation
      key="plant-animation"
      queryStatus={searchStatus}
      isInitialSearch={!dataUpdatedAt}
      hasCurrentResults={hasCurrentResults}
    />
  );
};

export default PlantSearchFooter;
