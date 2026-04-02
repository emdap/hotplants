import { NetworkStatus } from "@apollo/client";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import { PlantSearchParams } from "config/hotplantsConfig";
import {
  DEFAULT_SEARCH_FORM_STATE,
  PlantSearchContext,
  PlantSearchContextType,
} from "contexts/plantSearch/PlantSearchContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import useAddToGardenActionList from "hooks/plantActionLists/useAddToGardenActionList";
import usePlantSearchQueries, {
  DEFAULT_PAGE_SIZE,
} from "hooks/usePlantSearchQueries";
import PlantSearch from "pages/PlantSearch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const route = getRouteApi("/plant-search");

const PlantSearchProvider = () => {
  const navigate = useNavigate();
  const {
    plantFilter,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    lastOpened: _lastOpened,
    ...searchParams
  } = route.useSearch();

  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [searchFormState, setSearchFormState] = useState(
    DEFAULT_SEARCH_FORM_STATE(),
  );

  const [searchParamsDraft, setSearchParamsDraft] =
    useState<Partial<PlantSearchParams> | null>(searchParams);

  const updateSearchParamsDraft: PlantSearchContextType["updateSearchParamsDraft"] =
    (searchParams) =>
      setSearchParamsDraft((prev) => ({ ...prev, ...searchParams }));

  useEffect(() => {
    updateSearchParamsDraft({ plantName: searchParams.plantName });
  }, [searchParams.plantName]);

  useEffect(() => {
    updateSearchParamsDraft({ location: searchParams.location });
  }, [searchParams.location]);

  const applySearchParams = (params: Partial<PlantSearchParams>) => {
    setIsPrefilledSearch(false);

    navigate({
      to: ".",
      search: ({ page: _page, ...rest }) => ({
        ...rest,
        ...params,
      }),
    });
  };

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

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const getResultsContainer = useCallback(
    () => resultsContainerRef.current,
    [],
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

  const plantSearchActionList = useAddToGardenActionList();

  return (
    <PlantSearchContext.Provider
      value={{
        hasCurrentResults,

        isInfiniteScroll,
        setIsInfiniteScroll,

        searchParams,
        searchParamsDraft,

        updateSearchParamsDraft,
        applySearchParams,

        searchStatus,
        searchRecordQuery,
        plantSearchQuery,
        fetchMorePlants,

        searchFormState,
        setSearchFormState,

        getResultsContainer,
      }}
    >
      <PlantSelectionProvider
        plantList={
          (isInfiniteScroll
            ? plantSearchData?.results
            : plantSearchQuery.data?.plantSearch.results) ?? []
        }
        plantListLoading={plantSearchQuery.loading}
        plantActions={plantSearchActionList}
        boundingPolygon={searchParams.location?.boundingPolyCoords}
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
          <PlantSearch resultsContainerRef={resultsContainerRef} />
        )}
      </PlantSelectionProvider>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearchProvider;
