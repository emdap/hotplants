import { centroid } from "@turf/turf";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import LocationSearch from "components/LocationSearch";
import { PlantDataFilter } from "components/plantSearchFilters/filterFixtures";
import PlantFilters from "components/plantSearchFilters/PlantFilters";
import PlantAnimation from "components/plantSearchResults/PlantAnimation";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  ActiveIndexes,
  FullScreenElement,
  PlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import PageTitle from "designSystem/PageTitle";
import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { LocationWithPolygon } from "helpers/schemaTypesUtil";
import usePlantSearchQueries from "hooks/usePlantSearchQueries";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const FILTER_HOLDER_ID = "filter-holder";
const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const [fullScreenElement, setFullScreenElement] =
    useState<FullScreenElement | null>(null);
  const [plantSearchResults, setPlantSearchResults] =
    useState<PlantQueryResults>([]);
  const activeIndexesState = useState<ActiveIndexes>({
    plantIndex: null,
    mediaIndex: null,
  });

  const [searchLocation, setSearchLocation] =
    useState<LocationWithPolygon | null>(null);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);

  const [plantFilters, setPlantFilters] = useState<PlantDataFilter>({});
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const {
    plantSearchQuery: { data: { plantSearch } = {}, ...plantSearchQuery },
    searchRecordQuery: { data: searchRecord },
    scrapeQueryLoading,
    getPlantQuery,
    fetchNextPlantsPage,
  } = usePlantSearchQueries(plantSearchCriteria);

  useEffect(() => {
    setPlantSearchResults(plantSearch?.results ?? []);
  }, [plantSearch]);

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

  const searchPlants = () => {
    setPlantSearchCriteria({
      ...plantFilters,
      boundingPolyCoords: searchLocation?.boundingPolygon.geometry.coordinates,
    });

    if (plantSearchQuery.error) {
      plantSearchQuery.refetch();
    }
  };

  const scrollContainerRef = useRef<HTMLElement>(null);
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

  const hasBeenSearched = Boolean(searchRecord);
  const showScrapeLoader = searchRecord?.status === "SCRAPING";

  return (
    <PlantSearchContext.Provider
      value={{
        plantSearchResults,
        activeIndexes: activeIndexesState[0],
        setActiveIndexes: activeIndexesState[1],
        syncPlant,

        searchLocation,
        setSearchLocation,
        setCustomLocationPolygon,

        fullScreenElement,
        setFullScreenElement,
      }}
    >
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={classNames(
          "grow overflow-auto scroll-smooth px-2 2xl:pr-8 pt-4 flex flex-col",
          plantSearchResults.length && "md:pr-4 pb-4 gap-4"
        )}
      >
        <PageTitle>Plant Search</PageTitle>
        <div
          className={classNames(
            "flex max-md:flex-col gap-4 2xl:gap-12 grow",
            !plantSearchResults.length && "overflow-auto py-4"
          )}
        >
          <div
            id="filter-sidebar"
            className={classNames(
              "basis-1/3 md:max-w-lg md:min-w-sm",
              plantSearchResults.length
                ? "md:sticky -top-4 md:h-[calc(100dvh-1.5rem)]"
                : "h-max"
            )}
          >
            <div
              className={classNames(
                "md:h-full max-h-fit space-y-4",
                plantSearchResults.length && "md:overflow-auto pb-24"
              )}
            >
              <Card className="flex flex-col gap-2 items-start w-full !p-2">
                <LocationSearch
                  setLocationSearchLoading={setLocationSearchLoading}
                />
                {searchLocation && (
                  <a
                    href={`#${FILTER_HOLDER_ID}`}
                    className="md:hidden sticky top-0 z-20 justify-self-end"
                  >
                    <Button variant="primary">Jump to Filters</Button>
                  </a>
                )}
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
                  disabled={locationSearchLoading || scrapeQueryLoading}
                  variant="primary"
                  onClick={searchPlants}
                >
                  Apply filters
                </Button>
              </Card>
            </div>
          </div>

          <div
            id="results"
            className={classNames(
              "grow flex flex-col gap-6 sm:mx-auto",
              !plantSearchResults.length && "sticky top-0"
            )}
          >
            <AnimatePresence>
              {plantSearchResults.length && (
                <motion.div
                  key="scrape-status-bar"
                  className="sticky -top-4 z-20"
                  {...MOTION_FADE_IN}
                >
                  <ScrapeStatusBar searchRecord={searchRecord} />
                </motion.div>
              )}

              {plantSearchResults.length && (
                <PlantResultsHolder key="results-holder" />
              )}

              {(plantSearchResults.length === 0 || showScrapeLoader) && (
                <PlantAnimation
                  key="animation"
                  isLoading={showScrapeLoader}
                  currentResultsLength={plantSearchResults.length}
                  hasBeenSearched={hasBeenSearched}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
