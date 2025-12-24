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
import { PlantDataInput } from "generated/graphql/graphql";
import { isEqual } from "lodash";
import { useMemo, useState } from "react";

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
      className={classNames(
        "md:h-full max-h-fit space-y-4",
        hasCurrentResults && "md:overflow-auto md:pb-24"
      )}
    >
      <Card className="flex flex-col gap-2 items-start w-full !p-2">
        <LocationSearch setIsLoading={setSearchLocationLoading} />
        <MapProvider
          showAllPlants
          locationArea={searchLocation}
          isLoading={searchLocationLoading}
          className="w-full h-[200px] md:h-[300px] grow"
        />
      </Card>

      <Card id={FILTER_HOLDER_ID} className="space-y-4 scroll-m-6">
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
  );
};

export default PlantSearchFiltersHolder;
