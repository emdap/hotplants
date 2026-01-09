import { getRouteApi } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantQueryData } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useEffect, useState } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";

const route = getRouteApi("__root__");

const PlantSearchProvider = ({ children }: { children: ReactNode }) => {
  const {
    // page,
    search: routeSearchParams = null,
    filters: routeFilters = {},
  } = route.useSearch();

  const [plantFilters, setPlantFilters] =
    useState<PlantSearchFilters>(routeFilters);

  const [searchParams, setSearchParams] = useState<PlantSearchParams | null>(
    routeSearchParams
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

  const [cachedPlantData, setCachedPlantData] = useState<PlantQueryData>({
    count: 0,
    results: [],
  });

  useEffect(() => {
    searchStatus !== "CHECKING_STATUS" &&
      plantSearchData &&
      setCachedPlantData(plantSearchData);
  }, [searchStatus, plantSearchData]);

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults: Boolean(cachedPlantData.count),
        totalResultsCount: cachedPlantData.count,

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
        plantList={cachedPlantData.results}
        boundingPolygon={boundingPolyCoords}
      >
        {children}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
