import { getRouteApi } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useEffect, useState } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";

const route = getRouteApi("__root__");

const PlantSearchProvider = ({ children }: { children: ReactNode }) => {
  const { search: routeSearchParams, filters: routeFilters = {} } =
    route.useSearch();

  const [plantFilters, setPlantFilters] =
    useState<PlantSearchFilters>(routeFilters);

  const [searchParams, setSearchParams] = useState<PlantSearchParams | null>(
    null
  );
  const [searchParamsDraft, setSearchParamsDraft] = useState<
    Partial<PlantSearchParams>
  >(routeSearchParams ?? {});
  const updateSearchParamsDraft: PlantSearchContextType["updateSearchParamsDraft"] =
    (newParams) => setSearchParamsDraft((prev) => ({ ...prev, ...newParams }));

  const { boundingPolyCoords, locationName, locationSource } =
    searchParamsDraft;

  useEffect(() => {
    if (boundingPolyCoords && locationName && locationSource) {
      setSearchParams((prev) => ({
        ...prev,
        boundingPolyCoords,
        locationName,
        locationSource,
      }));
    }
  }, [boundingPolyCoords, locationName, locationSource]);

  const { searchStatus, plantSearchData, ...searchQueries } =
    usePlantSearchQueries(routeSearchParams, plantFilters);

  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);

  useEffect(() => {
    searchStatus !== "CHECKING_STATUS" &&
      plantSearchData &&
      setPlantSearchResults(plantSearchData.results);
  }, [searchStatus, plantSearchData]);

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults: Boolean(plantSearchResults.length),
        totalResultsCount: plantSearchData?.count ?? 0,

        searchParams,
        searchParamsDraft,
        updateSearchParamsDraft,
        setSearchParamsDraft,

        plantFilters,
        setPlantFilters,

        searchStatus,
        ...searchQueries,
      }}
    >
      <PlantSelectionProvider
        plantList={plantSearchResults}
        boundingPolygon={boundingPolyCoords}
      >
        {children}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
