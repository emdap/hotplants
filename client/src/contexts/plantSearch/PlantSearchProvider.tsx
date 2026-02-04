import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
  RESULTS_PANE_ID,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantQueryData } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";
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
    useState<Partial<PlantSearchParams> | null>(searchParams);

  const validateSearchParams = (
    params?: Partial<PlantSearchParams> | null,
  ): PlantSearchParams | null =>
    params?.boundingPolyCoords && params.locationName && params.locationSource
      ? (params as PlantSearchParams)
      : null;

  const validatedSearchParamsDraft = useMemo(
    () => validateSearchParams(searchParamsDraft),
    [searchParamsDraft],
  );

  useEffect(() => {
    setSearchParamsDraft(searchParams);
  }, [searchParams]);

  const applySearchParams = useCallback(
    (params?: Partial<PlantSearchParams>) => {
      const applyParams = validateSearchParams({
        ...searchParamsDraft,
        ...params,
      });
      if (applyParams) {
        document
          .getElementById(RESULTS_PANE_ID)
          ?.scrollIntoView({ behavior: "instant" });

        navigate({
          to: "/plant-search",
          search: { search: applyParams, filters: {} },
        });
        isSmallScreen() && setSidebarExpanded(false);
      }
    },
    [navigate, searchParamsDraft],
  );

  const applyPlantFilters = useCallback(
    (filters?: PlantSearchFilters) =>
      searchParams &&
      navigate({
        to: ".",
        search: { search: searchParams, filters },
      }),
    [navigate, searchParams],
  );

  const updateSearchParamsDraft: PlantSearchContextType["updateSearchParamsDraft"] =
    (searchParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...searchParams }));

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

        searchParams,

        searchParamsDraft,
        validatedSearchParamsDraft,

        updateSearchParamsDraft,
        applySearchParams,

        plantFilters,
        applyPlantFilters,

        searchStatus,
        ...searchQueries,

        sidebarExpanded,
        setSidebarExpanded,
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
