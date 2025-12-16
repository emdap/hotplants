import { Outlet } from "@tanstack/react-router";
import { centroid } from "@turf/turf";
import {
  ActiveIndexes,
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import {
  MEDIUM_SCREEN_SIZE,
  useGetScrollContainer,
} from "hooks/useGetScrollContainer";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { isEmpty, isEqual } from "lodash";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();

  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);
  const [activeIndexes, setActiveIndexes] = useState<ActiveIndexes>({
    plantIndex: null,
    mediaIndex: null,
  });

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);
  const [searchLocationLoading, setSearchLocationLoading] = useState(false);

  const [plantFilters, setPlantFilters] = useState<PlantDataInput>({});
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const hasResults = Boolean(plantSearchResults.length);

  const {
    status,
    plantSearchData,
    plantSearchQuery,
    searchRecordQuery,
    getPlantQuery,
    fetchNextPlantsPage,
    hasNextPage,
    // scrapeMoreData,
  } = usePlantSearchQueries(plantSearchCriteria);

  useEffect(() => {
    status !== "CHECKING_STATUS" &&
      plantSearchData &&
      setPlantSearchResults(plantSearchData.results);
  }, [status, plantSearchData]);

  const syncPlant = async (plantId: string) => {
    const { data } = await getPlantQuery({
      variables: {
        id: plantId,
        boundingPolyCoords: plantSearchCriteria?.boundingPolyCoords,
      },
    });

    if (data?.plant) {
      setPlantSearchResults((prev) =>
        prev.map((plantResult) =>
          data.plant && data.plant._id === plantResult._id
            ? data.plant
            : plantResult
        )
      );
    }
  };

  const setCustomLocationPolygon = (boundingPolygon: Feature<Polygon>) => {
    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);
    setSearchLocation({
      displayName: `${lat}, ${lng}`,
      locationSource: "map",
      boundingPolygon,
    });
  };

  const { hasSelectedFilters, draftCriteria } = useMemo(() => {
    const draftCriteria = {
      ...plantFilters,
      ...(searchLocation && {
        boundingPolyCoords: searchLocation.boundingPolygon.geometry.coordinates,
      }),
    };

    return {
      hasSelectedFilters: !isEmpty(draftCriteria),
      draftCriteria,
    };
  }, [plantFilters, searchLocation]);

  const hasNewCriteria = useMemo(
    () => hasSelectedFilters && !isEqual(draftCriteria, plantSearchCriteria),
    [hasSelectedFilters, draftCriteria, plantSearchCriteria]
  );

  const scrollToTop = () =>
    new Promise<void>((resolve) => {
      scrollContainerElement?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      const checkScrollInterval = setInterval(() => {
        if ((scrollContainerElement?.scrollTop ?? 10) <= 10) {
          clearInterval(checkScrollInterval);
          resolve();
        }
      });
    });

  const applyFilters = async () => {
    if (!searchLocation && !Object.keys(plantFilters).length) {
      return;
    }

    if (hasNewCriteria) {
      hasResults &&
        window.innerWidth >= MEDIUM_SCREEN_SIZE &&
        (await scrollToTop());
      setPlantSearchCriteria(draftCriteria);
    }

    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerElement) {
        return;
      }
      if (
        scrollContainerElement.scrollHeight -
          (scrollContainerElement.scrollTop +
            scrollContainerElement.clientHeight) <=
        FETCH_MORE_SCROLL_THRESHOLD
      ) {
        fetchNextPlantsPage();
      }
    };

    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [fetchNextPlantsPage, scrollContainer, scrollContainerElement]);

  return (
    <PlantSearchContext.Provider
      value={{
        plantSearchResults,
        activeIndexes,
        setActiveIndexes,
        syncPlant,

        searchLocation,
        setSearchLocation,
        setCustomLocationPolygon,

        searchLocationLoading,
        setSearchLocationLoading,

        fullScreenElement,
        setFullScreenElement,
      }}
    >
      <Outlet />
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
