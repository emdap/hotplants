import { centroid } from "@turf/turf";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import LocationSearch from "components/LocationSearch";
import PlantAnimation from "components/PlantAnimation";
import PlantFilters from "components/plantSearchFilters/PlantFilters";
import ActivePlantPane from "components/plantSearchResults/ActivePlantPane";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  ActiveIndexes,
  FILTER_HOLDER_ID,
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import PageTitle from "designSystem/PageTitle";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { LocationWithPolygon } from "helpers/schemaTypesUtil";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { isEmpty, isEqual } from "lodash";
import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const scrollContainerRef = useRef<HTMLElement>(null);

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
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      const checkScrollInterval = setInterval(() => {
        if ((scrollContainerRef.current?.scrollTop ?? 10) <= 10) {
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
      // 768 is the md screen size breakpoint
      hasResults && window.innerWidth >= 768 && (await scrollToTop());
      setPlantSearchCriteria(draftCriteria);
    }

    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }
    if (
      scrollContainer.scrollHeight -
        (scrollContainer.scrollTop + scrollContainer.clientHeight) <=
      FETCH_MORE_SCROLL_THRESHOLD
    ) {
      fetchNextPlantsPage();
    }
  };

  const isShowingAllResults =
    !plantSearchData ||
    plantSearchData.count === plantSearchData.results.length;

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
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={classNames(
          "grow overflow-auto max-md:mr-1 scroll-smooth px-2 2xl:pr-8 pt-4 flex flex-col gap-4 max-md:pb-10",
          hasResults && "md:pr-4 md:pb-4"
        )}
      >
        <PageTitle>Plant Search</PageTitle>
        <div
          className={classNames(
            "flex max-md:flex-col gap-y-12 gap-x-4 2xl:gap-x-12 grow",
            !hasResults && "pb-10"
          )}
        >
          <div
            id="filter-sidebar"
            className={classNames(
              "basis-1/3 md:max-w-lg md:min-w-sm",
              hasResults
                ? "md:sticky -top-4 md:h-[calc(100dvh-2.5rem)]"
                : "h-max"
            )}
          >
            <div
              className={classNames(
                "md:h-full max-h-fit space-y-4",
                hasResults && "md:overflow-auto md:pb-24"
              )}
            >
              <Card className="flex flex-col gap-2 items-start w-full !p-2">
                <LocationSearch />
                <MapProvider
                  showAllPlants
                  className="w-full h-[200px] md:h-[300px] grow"
                />
              </Card>

              <Card id={FILTER_HOLDER_ID} className="space-y-4">
                <PlantFilters
                  plantFilters={plantFilters}
                  setPlantFilters={setPlantFilters}
                />
                <Button
                  className="mt-auto"
                  disabled={!hasNewCriteria}
                  isLoading={searchLocationLoading || status !== "READY"}
                  variant="primary"
                  onClick={applyFilters}
                >
                  Apply filters
                </Button>
              </Card>
            </div>
          </div>

          <div
            id="results-pane"
            className={classNames(
              "grow flex flex-col gap-6 sm:mx-auto relative",
              !hasResults && "md:sticky md:top-20 h-fit"
            )}
          >
            <AnimatePresence>
              <div
                key="status-bar"
                className={classNames(
                  "sticky -top-4 z-20 transition-opacity",
                  hasResults ? "opacity-100" : "opacity-0 max-md:h-0"
                )}
              >
                <ScrapeStatusBar
                  plantQueryStatus={status}
                  totalResultsCount={plantSearchData?.count}
                >
                  {/* {searchRecordQuery.data && (
                    <Button
                      className="ml-auto"
                      disabled={!isShowingAllResults}
                      onClick={() => scrapeMoreData()}
                      isLoading={searchRecordQuery.data.status !== "READY"}
                    >
                      {searchRecordQuery.data.status === "COMPLETE"
                        ? "All plants scraped"
                        : "Scrape more plants"}
                    </Button>
                  )} */}
                </ScrapeStatusBar>
              </div>

              <PlantResultsHolder key="results-holder" />

              {!isShowingAllResults && status !== "CHECKING_STATUS" ? (
                <LoadingIcon
                  key="loading-icon"
                  size={25}
                  containerClassName="text-white mx-auto mt-auto pb-4"
                />
              ) : (
                <PlantAnimation
                  key="plant-animation"
                  queryStatus={status}
                  isInitialSearch={!searchRecordQuery.dataUpdatedAt}
                  hasCurrentResults={hasResults}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ActivePlantPane />
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
