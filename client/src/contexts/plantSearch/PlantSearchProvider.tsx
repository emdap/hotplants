import { NetworkStatus } from "@apollo/client";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
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
import { PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

const route = getRouteApi("/plant-search");

const PlantSearchProvider = () => {
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);

  const navigate = useNavigate();

  const {
    plantFilter,

    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    search: searchParams = null,
  } = route.useSearch();

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<PlantSearchParams> | null>(searchParams);

  useEffect(() => {
    setIsPrefilledSearch;
  }, [searchParams, plantFilter, page, pageSize]);

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
        setIsPrefilledSearch(false);

        navigate({
          to: ".",
          search: ({ pageSize, plantFilter }) => ({
            pageSize,
            search: applyParams,
            plantFilter,
          }),
        });
        isSmallScreen() && setShowSearchForm(false);
      }
    },
    [navigate, searchParamsDraft],
  );

  const updateSearchParamsDraft: PlantSearchContextType["updateSearchParamsDraft"] =
    (searchParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...searchParams }));

  const { searchStatus, plantSearchQuery, searchRecordQuery, scrapeMoreData } =
    usePlantSearchQueries(searchParams, plantFilter, {
      page,
      pageSize,
      paginationEnabled: !isInfiniteScroll,
    });

  const plantSearchData = plantSearchQuery.data
    ? plantSearchQuery.data.plantSearch
    : plantSearchQuery.loading
      ? plantSearchQuery.previousData?.plantSearch
      : null;

  const [isPrefilledSearch, setIsPrefilledSearch] = useState(
    Boolean(searchParams && plantSearchQuery.loading),
  );
  useEffect(() => {
    !plantSearchQuery.loading && setIsPrefilledSearch(false);
  }, [plantSearchQuery.loading]);

  const { totalItems, hasCurrentResults } = useMemo(
    () => ({
      totalItems: plantSearchData?.count ?? 0,
      hasCurrentResults: Boolean(plantSearchData?.count),
    }),
    [plantSearchData?.count],
  );

  const fetchMorePlants = async () => {
    if (
      searchStatus !== "READY" ||
      !plantSearchData?.results ||
      plantSearchQuery.networkStatus === NetworkStatus.fetchMore
    ) {
      return;
    }

    if (!isInfiniteScroll) {
      return scrapeMoreData();
    } else if (plantSearchData.results.length < totalItems) {
      plantSearchQuery.fetchMore({
        variables: { offset: plantSearchData.results.length },
      });
      navigate({ to: ".", search: (prev) => ({ ...prev, page: page + 1 }) });
    }
  };

  const [showSearchForm, setShowSearchForm] = useState(!isSmallScreen());
  useEffect(() => {
    const toggleSidebar = () => setShowSearchForm(!isSmallScreen());

    window.addEventListener("resize", toggleSidebar);
    return () => window.removeEventListener("resize", toggleSidebar);
  }, []);

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults,

        isInfiniteScroll,
        setIsInfiniteScroll,

        searchParams,
        searchParamsDraft,
        validatedSearchParamsDraft,

        updateSearchParamsDraft,
        applySearchParams,

        searchStatus,
        searchRecordQuery,
        plantSearchQuery,
        fetchMorePlants,

        showSearchForm,
        setShowSearchForm,
      }}
    >
      <PlantSelectionProvider
        plantList={
          (isInfiniteScroll
            ? plantSearchData?.results
            : plantSearchQuery.data?.plantSearch.results) ?? []
        }
        plantListLoading={plantSearchQuery.loading}
        boundingPolygon={searchParams?.boundingPolyCoords}
        {...{
          page,
          pageSize,
          totalItems,
        }}
      >
        {isPrefilledSearch ? (
          <PlantAnimation
            className="h-dvh-header"
            queryStatus="CHECKING_STATUS"
          />
        ) : (
          <PlantSearch />
        )}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
