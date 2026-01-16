import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantQueryData } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

const route = getRouteApi("__root__");

const PlantSearchProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const {
    // page,
    search: searchParams = null,
    filters: plantFilters = {},
  } = route.useSearch();

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<PlantSearchParams | null>(searchParams);

  const applySearchParams = useCallback(() => {
    navigate({ to: ".", search: { search: searchParamsDraft } });
    isSmallScreen() && setSidebarExpanded(false);
  }, [navigate, searchParamsDraft]);

  const applyPlantFilters = useCallback(
    () =>
      searchParams &&
      navigate({
        to: ".",
        search: { search: searchParams, filters: plantFilters },
      }),
    [navigate, searchParams, plantFilters]
  );

  const updateSearchParamsDraft: PlantSearchContextType["updateSearchParamsDraft"] =
    (locationParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...locationParams }));

  const { searchStatus, plantSearchData, ...searchQueries } =
    usePlantSearchQueries(searchParams, plantFilters);

  const [cachedPlantData, setCachedPlantData] = useState<PlantQueryData>({
    count: 0,
    results: [],
  });

  useEffect(() => {
    searchStatus !== "CHECKING_STATUS" &&
      plantSearchData &&
      setCachedPlantData(plantSearchData);
  }, [searchStatus, plantSearchData]);

  const [sidebarExpanded, setSidebarExpanded] = useState(!isSmallScreen());
  useEffect(() => {
    const toggleSidebar = () => setSidebarExpanded(!isSmallScreen());

    window.addEventListener("resize", toggleSidebar);
    return () => window.removeEventListener("resize", toggleSidebar);
  }, []);

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults: Boolean(cachedPlantData.count),
        totalResultsCount: cachedPlantData.count,

        sidebarExpanded,
        setSidebarExpanded,

        searchParams,
        searchParamsDraft,
        updateSearchParamsDraft,
        setSearchParamsDraft,
        applySearchParams,

        plantFilters,
        applyPlantFilters,

        searchStatus,
        ...searchQueries,
      }}
    >
      <PlantSelectionProvider
        plantList={cachedPlantData.results}
        boundingPolygon={searchParams?.boundingPolyCoords}
      >
        {children}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
