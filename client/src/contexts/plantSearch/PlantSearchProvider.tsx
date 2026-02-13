import { NetworkStatus } from "@apollo/client";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import usePlantSearchQueries, {
  DEFAULT_PAGE_SIZE,
} from "hooks/usePlantSearchQueries";
import PlantSearch from "pages/PlantSearch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

const route = getRouteApi("/plant-search");

const PlantSearchProvider = () => {
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(!isSmallScreen());

  const navigate = useNavigate();

  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search: searchParams = null,
    filters: plantFilters = {},
  } = route.useSearch();

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<PlantSearchParams> | null>(searchParams);

  useEffect(() => {
    setSearchParamsDraft(searchParams);
  }, [searchParams]);

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

  const { searchStatus, plantSearchQuery, searchRecordQuery } =
    usePlantSearchQueries(searchParams, plantFilters, {
      page,
      pageSize,
      paginationEnabled: !isInfiniteScroll,
    });

  const plantSearchData = plantSearchQuery.data
    ? plantSearchQuery.data.plantSearch
    : plantSearchQuery.loading
      ? plantSearchQuery.previousData?.plantSearch
      : null;

  const { hasCurrentResults, totalResultsCount } = useMemo(
    () => ({
      hasCurrentResults: Boolean(plantSearchData?.count),
      totalResultsCount: plantSearchData?.count ?? 0,
    }),
    [plantSearchData?.count],
  );

  const unfetchedPlants = plantSearchData
    ? plantSearchData.count - plantSearchData.results.length
    : 0;

  const fetchMorePlants = async () => {
    if (
      !plantSearchData?.results ||
      plantSearchQuery.networkStatus === NetworkStatus.fetchMore
    ) {
      return;
    }

    if (
      (searchStatus === "READY" && unfetchedPlants) ||
      unfetchedPlants >= (pageSize ?? DEFAULT_PAGE_SIZE)
    ) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearchData.results.length },
      });
    }
  };

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
        hasMoreData: Boolean(unfetchedPlants),
        searchRecordQuery,
        plantSearchQuery,
        fetchMorePlants,

        sidebarExpanded,
        setSidebarExpanded,
      }}
    >
      <PlantSelectionProvider
        plantList={
          (isInfiniteScroll
            ? plantSearchData?.results
            : plantSearchQuery.data?.plantSearch.results) ?? []
        }
        boundingPolygon={searchParams?.boundingPolyCoords}
      >
        <PlantSearch />
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
