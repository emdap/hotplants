import { NetworkStatus } from "@apollo/client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import {
  DEFAULT_SEARCH_FORM_STATE,
  EntitySearchContext,
} from "contexts/entitySearch/EntitySearchContext";
import EntitySelectionProvider from "contexts/entitySelection/EntitySelectionProvider";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import { EntityType } from "generated/graphql/graphql";
import useAddToGardenActionList from "hooks/entityActionLists/useAddToGardenActionList";
import useEntitySearchQueries, {
  DEFAULT_PAGE_SIZE,
} from "hooks/useEntitySearchQueries";
import PlantSearch from "pages/BrowseEntities";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EntitySearchProvider = ({ entityType }: { entityType: EntityType }) => {
  const navigate = useNavigate();
  const { searchParams, isPrefilledSearch, setIsPrefilledSearch } =
    useSearchParamsContext();
  const {
    plantFilter,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    lastOpened: _lastOpened,
  } = useSearch({ strict: false });

  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [searchFormState, setSearchFormState] = useState(
    DEFAULT_SEARCH_FORM_STATE(),
  );

  const {
    searchStatus,
    entitySearchQuery: plantSearchQuery,
    searchRecordQuery,
    scrapeMoreData,
  } = useEntitySearchQueries(searchParams, plantFilter, {
    page,
    pageSize,
    paginationEnabled: !isInfiniteScroll,
  });

  useEffect(() => {
    !plantSearchQuery.loading && setIsPrefilledSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantSearchQuery.loading]);

  const plantSearchData = plantSearchQuery.data
    ? plantSearchQuery.data.plantSearch
    : plantSearchQuery.loading
      ? plantSearchQuery.previousData?.plantSearch
      : null;

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
    <EntitySearchContext.Provider
      value={{
        entityType,
        hasCurrentResults,

        isInfiniteScroll,
        setIsInfiniteScroll,

        searchStatus,
        searchRecordQuery,
        entitySearchQuery: plantSearchQuery,
        fetchMore: fetchMorePlants,

        searchFormState,
        setSearchFormState,

        getResultsContainer,
      }}
    >
      <EntitySelectionProvider
        entityType={entityType}
        entityList={
          (isInfiniteScroll
            ? plantSearchData?.results
            : plantSearchQuery.data?.plantSearch.results) ?? []
        }
        entityListLoading={plantSearchQuery.loading}
        entityActions={
          entityType === "plant" ? plantSearchActionList : undefined
        }
        boundingPolygon={searchParams.location?.boundingPolyCoords}
        {...{
          page,
          pageSize,
          totalItems,
        }}
      >
        {isPrefilledSearch ? (
          <PlantAnimation
            showServerStatus
            className="h-dvh-header"
            queryStatus="CHECKING_STATUS"
          />
        ) : (
          <PlantSearch resultsContainerRef={resultsContainerRef} />
        )}
      </EntitySelectionProvider>
    </EntitySearchContext.Provider>
  );
};

export default EntitySearchProvider;
