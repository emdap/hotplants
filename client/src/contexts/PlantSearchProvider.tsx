import { centroid } from "@turf/turf";
import {
  ActiveIndexes,
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useEffect, useState } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

const PlantSearchProvider = ({ children }: { children: ReactNode }) => {
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);
  const [searchLocationLoading, setSearchLocationLoading] = useState(false);

  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [activeIndexes, setActiveIndexes] = useState<ActiveIndexes>({
    plantIndex: null,
    mediaIndex: null,
  });

  const {
    searchStatus,
    plantSearchData,
    plantSearchQuery,
    getPlantQuery,
    ...searchQueries
  } = usePlantSearchQueries(plantSearchCriteria);

  useEffect(() => {
    searchStatus !== "CHECKING_STATUS" &&
      plantSearchData &&
      setPlantSearchResults(plantSearchData.results);
  }, [searchStatus, plantSearchData]);

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

  const applyPlantSearchCriteria = (newCriteria: PlantDataInput) => {
    setPlantSearchCriteria(newCriteria);
    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  return (
    <PlantSearchContext.Provider
      value={{
        plantSearchResults,
        hasCurrentResults: Boolean(plantSearchResults.length),
        totalResultsCount: plantSearchData?.count ?? 0,

        plantSearchCriteria,
        setPlantSearchCriteria: applyPlantSearchCriteria,

        activeIndexes,
        setActiveIndexes,
        syncPlant,

        searchLocation,
        setSearchLocation,
        setCustomLocationPolygon,

        searchLocationLoading,
        setSearchLocationLoading,

        fullScreenElement,
        setFullScreenElement,

        searchStatus,
        ...searchQueries,
      }}
    >
      {children}
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
