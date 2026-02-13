import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import { PlantQueryData } from "graphqlHelpers/plantQueries";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import PlantSearch from "pages/PlantSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

const route = getRouteApi("/plant-search");

const DEFAULT_CACHED_PLANT_DATA = {
  count: 0,
  results: [],
};

const PlantSearchProvider = () => {
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(!isSmallScreen());

  const navigate = useNavigate();

  const {
    page = 1,
    pageSize = 20,
    search: searchParams = null,
    filters: plantFilters = {},
  } = route.useSearch();

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<PlantSearchParams> | null>(searchParams);

  useEffect(() => {
    setSearchParamsDraft(searchParams);
  }, [searchParams]);

  const [cachedPlantData, setCachedPlantData] = useState<PlantQueryData>(
    DEFAULT_CACHED_PLANT_DATA,
  );

  const { hasCurrentResults, totalResultsCount } = useMemo(
    () => ({
      hasCurrentResults: Boolean(cachedPlantData.count),
      totalResultsCount: cachedPlantData.count,
    }),
    [cachedPlantData.count],
  );

  useEffect(() => {
    if (!searchParams && hasCurrentResults) {
      setSearchParamsDraft(null);
      setCachedPlantData(DEFAULT_CACHED_PLANT_DATA);
    }
  }, [searchParams, hasCurrentResults]);

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

  const applySearchParams = useCallback(
    (params?: Partial<PlantSearchParams>) => {
      const applyParams = validateSearchParams({
        ...searchParamsDraft,
        ...params,
      });
      if (applyParams) {
        navigate({
          to: ".",
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
    usePlantSearchQueries(searchParams, plantFilters, { page, pageSize });

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
        hasCurrentResults,
        totalResultsCount,

        isInfiniteScroll,
        setIsInfiniteScroll,

        searchParams,
        page,
        pageSize,

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
        <PlantSearch />
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
