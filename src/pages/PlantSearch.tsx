import MapProvider from "components/interactiveMap/MapProvider";
import LocationSearch from "components/plantFilters/LocationSearch";
import PlantCharacteristicsFilter from "components/plantFilters/PlantCharacteristicsFilter";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { useCallback, useEffect, useState } from "react";
import { LocationWithPolygon } from "schemaHelpers/schemaTypesUtil";

const PlantSearch = () => {
  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);
  const [locationSearchLoading, setLocationSearchLoading] = useState(true);

  const [plantFilters, setPlantFilters] = useState<Omit<
    PlantDataInput,
    "bboxPolyCoords"
  > | null>(null);
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const {
    plantSearchQuery: { data: { plantSearch } = {} },
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

  const setCustomLocationPolygon = (boundingPolygon: Feature<Polygon>) =>
    setSearchLocation({
      locationSource: "map",
      boundingPolygon,
    });

  const applyFilters = useCallback(
    () =>
      setPlantSearchCriteria((prev) => ({
        ...prev,
        boundingPolyCoords:
          searchLocation?.boundingPolygon.geometry.coordinates,
      })),
    [
      setPlantSearchCriteria,
      searchLocation?.boundingPolygon.geometry.coordinates,
    ]
  );

  useEffect(() => {
    if (
      plantSearch?.results.length &&
      searchLocation?.locationSource === "map"
    ) {
      applyFilters();
    }
  }, [plantSearch, searchLocation, applyFilters]);

  return (
    <PlantSearchContext.Provider
      value={{
        syncPlant,

        searchLocation,
        setSearchLocation,
        setCustomLocationPolygon,

        fullScreenElement,
        setFullScreenElement,
      }}
    >
      <main className="h-full relative overflow-hidden flex flex-col">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex gap-4">
            <Card className="flex flex-col gap-2 flex-grow">
              <LocationSearch
                setLocationSearchLoading={setLocationSearchLoading}
              />
              <PlantCharacteristicsFilter
                plantFilters={plantFilters}
                setPlantFilters={setPlantFilters}
              />
            </Card>
            <MapProvider className="w-1/2 flex-grow" />
          </div>
          <Button
            disabled={locationSearchLoading}
            variant="primary"
            onClick={applyFilters}
          >
            Search
          </Button>
          <ScrapeStatusBar
            searchRecord={searchRecordQuery.data?.searchRecord}
          />
        </div>

        <PlantResultsHolder
          searchResults={plantSearchResults}
          fetchMorePlants={fetchMorePlants}
        />
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
