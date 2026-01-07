import { PlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantDataInput } from "generated/graphql/graphql";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

const PlantSearchProvider = ({ children }: { children: ReactNode }) => {
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);

  // TODO: More elegant solution for saving this
  const searchLocationName = useMemo(
    () =>
      searchLocation?.locationSource === "search"
        ? `Custom Location, ${searchLocation.displayName}`
        : searchLocation?.displayName,
    [searchLocation?.displayName, searchLocation?.locationSource]
  );

  const { searchStatus, plantSearchData, plantSearchQuery, ...searchQueries } =
    usePlantSearchQueries(plantSearchCriteria, searchLocationName);

  useEffect(() => {
    searchStatus !== "CHECKING_STATUS" &&
      plantSearchData &&
      setPlantSearchResults(plantSearchData.results);
  }, [searchStatus, plantSearchData]);

  const applyPlantSearchCriteria = (newCriteria: PlantDataInput) => {
    setPlantSearchCriteria(newCriteria);
    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults: Boolean(plantSearchResults.length),
        totalResultsCount: plantSearchData?.count ?? 0,

        plantSearchCriteria,
        setPlantSearchCriteria: applyPlantSearchCriteria,

        searchLocation,
        setSearchLocation,

        searchStatus,
        ...searchQueries,
      }}
    >
      <PlantSelectionProvider
        plantList={plantSearchResults}
        boundingPolygon={plantSearchCriteria?.boundingPolyCoords}
      >
        {children}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
