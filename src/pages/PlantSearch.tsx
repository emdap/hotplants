import { centroid } from "@turf/turf";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import LocationSearch from "components/LocationSearch";
import { PlantDataFilter } from "components/plantSearchFilters/filterFixtures";
import PlantFilters from "components/plantSearchFilters/PlantFilters";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  ActiveIndexes,
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import PageTitle from "designSystem/PageTitle";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { LocationWithPolygon } from "helpers/schemaTypesUtil";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { useCallback, useEffect, useState } from "react";

const PlantSearch = () => {
  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);
  const activeIndexesState = useState<ActiveIndexes>({
    plantIndex: null,
    mediaIndex: null,
  });

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);

  const [plantFilters, setPlantFilters] = useState<PlantDataFilter>({});
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const {
    plantSearchQuery: { data: { plantSearch } = {}, ...plantSearchQuery },
    searchRecordQuery,
    getPlantQuery,
    fetchMorePlants,
  } = usePlantSearchQueries(plantSearchCriteria);

  useEffect(() => {
    setPlantSearchResults(plantSearch?.results ?? []);
  }, [plantSearch]);

  const syncPlant = async (plantId: string) => {
    const { data } = await getPlantQuery({
      variables: {
        id: plantId,
        boundingPolyCoords: plantSearchCriteria?.boundingPolyCoords,
      },
    });

    if (data?.plant) {
      setPlantSearchResults((prev) =>
        prev.map((plantResult) =>
          data.plant && data.plant._id === plantResult._id
            ? data.plant
            : plantResult
        )
      );
    }
  };

  const setCustomLocationPolygon = (boundingPolygon: Feature<Polygon>) => {
    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);
    setSearchLocation({
      displayName: `${lat}, ${lng}`,
      locationSource: "map",
      boundingPolygon,
    });
  };

  const applyFilters = useCallback(() => {
    setPlantSearchCriteria({
      ...plantFilters,
      boundingPolyCoords: searchLocation?.boundingPolygon.geometry.coordinates,
    });
  }, [plantFilters, searchLocation?.boundingPolygon.geometry.coordinates]);

  useEffect(() => {
    if (plantSearch?.results.length || searchLocation !== null) {
      applyFilters();
    }
  }, [plantSearch, searchLocation, applyFilters]);

  const searchPlants = () => {
    applyFilters();
    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  return (
    <PlantSearchContext.Provider
      value={{
        plantSearchResults,
        activeIndexes: activeIndexesState[0],
        setActiveIndexes: activeIndexesState[1],
        syncPlant,

        searchLocation,
        setSearchLocation,
        setCustomLocationPolygon,

        fullScreenElement,
        setFullScreenElement,
      }}
    >
      <main className="flex-grow overflow-auto scroll-smooth px-2 2xl:pr-8 py-4 space-y-4 flex flex-col">
        <PageTitle>Plant Search</PageTitle>
        <div
          className={classNames(
            "flex max-sm:flex-col gap-4 2xl:gap-12",
            !plantSearchResults.length && "min-h-full"
          )}
        >
          <div className="basis-1/3 sm:sticky -top-4 sm:max-w-lg sm:h-[calc(100dvh_-_1.5rem)]">
            <div className="sm:overflow-auto sm:h-full space-y-4 pb-4">
              <Card className="flex flex-col gap-2 w-full !p-2">
                <LocationSearch
                  setLocationSearchLoading={setLocationSearchLoading}
                />
                <MapProvider
                  showAllPlants
                  className="w-full h-[200px] md:h-[350px] flex-grow"
                />
              </Card>

              <Card className="space">
                <PlantFilters
                  plantFilters={plantFilters}
                  setPlantFilters={setPlantFilters}
                />
                <Button
                  className="mt-auto"
                  disabled={locationSearchLoading}
                  variant="primary"
                  onClick={searchPlants}
                >
                  Apply filters
                </Button>
              </Card>
            </div>
          </div>

          <div className="flex-grow space-y-6 h-fit sm:mx-auto">
            <div className="sticky -top-4 z-20">
              <ScrapeStatusBar
                searchRecord={searchRecordQuery.data?.searchRecord}
              />
            </div>
            <PlantResultsHolder fetchMorePlants={fetchMorePlants} />
          </div>
        </div>
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
