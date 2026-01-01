import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import PlantFilters from "components/plantFilters/PlantSearchFilters";
import LocationSearch from "components/plantSearch/LocationSearch";
import {
  FILTER_HOLDER_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import VerticalDivider from "designSystem/VerticalDivider";
import { PlantDataInput } from "generated/graphql/graphql";
import { isEqual } from "lodash";
import { useMemo, useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useSwipeable } from "react-swipeable";

const RESULTS_HOLDER_ID = "results-pane";

const PlantSearchFiltersHolder = () => {
  const {
    plantSearchCriteria,
    hasCurrentResults,
    searchLocation,
    searchStatus,
    setPlantSearchCriteria,
  } = usePlantSearchContext();

  const [plantFilters, setPlantFilters] = useState<PlantDataInput>({});
  const [searchLocationLoading, setSearchLocationLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsExpanded(false),
  });

  const { filtersAreValid, draftCriteria } = useMemo(() => {
    const draftCriteria = {
      ...plantFilters,
      ...(searchLocation && {
        boundingPolyCoords: searchLocation.boundingPolygon.geometry.coordinates,
      }),
    };

    return {
      draftCriteria,
      filtersAreValid:
        Object.keys(draftCriteria).length &&
        !isEqual(draftCriteria, plantSearchCriteria),
    };
  }, [plantFilters, searchLocation, plantSearchCriteria]);

  const applyFilters = () =>
    filtersAreValid && setPlantSearchCriteria(draftCriteria);

  return (
    <div
      {...swipeHandlers}
      className={classNames(
        "transition-all relative w-full",
        hasCurrentResults
          ? "lg:sticky lg:top-header lg:h-dvh-header lg:pr-4 lg:mr-2"
          : "h-max pb-20",
        isExpanded ? "lg:w-sm" : "lg:w-0"
      )}
    >
      <div
        className={classNames(
          "lg:h-full max-h-fit space-y-4",
          hasCurrentResults && "lg:overflow-auto lg:pb-24"
        )}
      >
        <Card className="flex flex-col gap-2 items-start w-full !p-2">
          <LocationSearch setIsLoading={setSearchLocationLoading} />
          <MapProvider
            locationCustomizeable
            isLoading={searchLocationLoading}
            className="w-full h-[200px] lg:h-[300px] grow"
          />
        </Card>

        <Card id={FILTER_HOLDER_ID} className="space-y-4 scroll-m-8">
          <PlantFilters
            plantFilters={plantFilters}
            setPlantFilters={setPlantFilters}
          />
          <Button
            linkAddress={`#${RESULTS_HOLDER_ID}`}
            disabled={!filtersAreValid}
            className="mt-auto"
            isLoading={searchLocationLoading || searchStatus !== "READY"}
            variant="primary"
            onClick={applyFilters}
          >
            Apply filters
          </Button>
        </Card>
      </div>

      {hasCurrentResults && (
        <div
          className={classNames(
            "max-lg:hidden flex flex-col gap-2 h-full absolute top-0 py-2 transition-all",
            isExpanded ? "right-0" : "right-6"
          )}
        >
          <VerticalDivider className="h-4" />
          <Button
            variant="text"
            size="small"
            icon={<MdChevronLeft size={16} />}
            onClick={() => setIsExpanded(!isExpanded)}
            className={classNames(
              "text-white! p-1! !-mr-3 border hover:border-white/60 border-transparent rounded-full! transition-all",
              isExpanded ? "rotate-0" : "rotate-180"
            )}
          />
          <VerticalDivider className="grow" />
        </div>
      )}
    </div>
  );
};

export default PlantSearchFiltersHolder;
