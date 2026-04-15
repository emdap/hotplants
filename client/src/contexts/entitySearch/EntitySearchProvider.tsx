import { NetworkStatus } from "@apollo/client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import PlantAnimation from "components/PlantAnimation";
import {
  DEFAULT_SEARCH_FORM_STATE,
  EntitySearchContext,
} from "contexts/entitySearch/EntitySearchContext";
import EntitySelectionProvider from "contexts/entitySelection/EntitySelectionProvider";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import useAddToGardenActionList from "hooks/entityActionLists/useAddToGardenActionList";
import useEntitySearchQueries, {
  DEFAULT_PAGE_SIZE,
} from "hooks/useEntitySearchQueries";
import BrowseEntities from "pages/BrowseEntities";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const EntitySearchProvider = () => {
  const navigate = useNavigate();
  const {
    entityType,
    location,
    entityName,

    isPrefilledSearch,
    setIsPrefilledSearch,
  } = useSearchParamsContext();

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

  const { searchStatus, entitySearchQuery, searchRecordQuery, scrapeMoreData } =
    useEntitySearchQueries({ location, entityName, entityType }, plantFilter, {
      page,
      pageSize,
      paginationEnabled: !isInfiniteScroll,
    });

  useEffect(() => {
    !entitySearchQuery.loading && setIsPrefilledSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySearchQuery.loading]);

  const searchData = entitySearchQuery.data
    ? entitySearchQuery.data.plantSearch
    : entitySearchQuery.loading
      ? entitySearchQuery.previousData?.plantSearch
      : null;

  const { totalItems, hasCurrentResults } = useMemo(
    () => ({
      totalItems: searchData?.count ?? 0,
      hasCurrentResults: Boolean(searchData?.count),
    }),
    [searchData?.count],
  );

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const getResultsContainer = useCallback(
    () => resultsContainerRef.current,
    [],
  );

  const fetchMore = async () => {
    if (
      searchStatus !== "READY" ||
      !searchData?.results ||
      entitySearchQuery.networkStatus === NetworkStatus.fetchMore
    ) {
      return;
    }

    if (!isInfiniteScroll) {
      return scrapeMoreData();
    } else if (searchData.results.length < totalItems) {
      entitySearchQuery.fetchMore({
        variables: { offset: searchData.results.length },
      });
      navigate({ to: ".", search: (prev) => ({ ...prev, page: page + 1 }) });
    }
  };

  const addToGardenActions = useAddToGardenActionList();

  return (
    <EntitySearchContext.Provider
      value={{
        hasCurrentResults,

        isInfiniteScroll,
        setIsInfiniteScroll,

        searchStatus,
        searchRecordQuery,
        entitySearchQuery,
        fetchMore,

        searchFormState,
        setSearchFormState,

        getResultsContainer,
      }}
    >
      <EntitySelectionProvider
        entityType={entityType}
        entityList={
          (isInfiniteScroll
            ? searchData?.results
            : entitySearchQuery.data?.plantSearch.results) ?? []
        }
        entityListLoading={entitySearchQuery.loading}
        entityActions={entityType === "plant" ? addToGardenActions : undefined}
        boundingPolygon={location?.boundingPolyCoords}
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
          <BrowseEntities resultsContainerRef={resultsContainerRef} />
        )}
      </EntitySelectionProvider>
    </EntitySearchContext.Provider>
  );
};

export default EntitySearchProvider;
