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
import { isEqual } from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const scrollContainerRef = useRef<HTMLElement>(null);

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
  const [searchLocationLoading, setSearchLocationLoading] = useState(false);

  const [plantFilters, setPlantFilters] = useState<PlantDataFilter>({});
  const [plantSearchCriteria, setPlantSearchCriteria] =
    useState<PlantDataInput | null>(null);

  const {
    status,
    plantSearchData,
    plantSearchQuery,
    searchRecordQuery,
    getPlantQuery,
    fetchNextPlantsPage,
  } = usePlantSearchQueries(plantSearchCriteria);

  useEffect(() => {
    plantSearchData && setPlantSearchResults(plantSearchData.results);
  }, [plantSearchData]);

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

  const draftCriteria = useMemo(
    () => ({
      ...plantFilters,
      boundingPolyCoords: searchLocation?.boundingPolygon.geometry.coordinates,
    }),
    [plantFilters, searchLocation?.boundingPolygon]
  );

  const criteriaIsChanged = useMemo(
    () => !isEqual(draftCriteria, plantSearchCriteria),
    [draftCriteria, plantSearchCriteria]
  );

  const searchPlants = () => {
    if (!searchLocation && !Object.keys(plantFilters).length) {
      return;
    }

    if (criteriaIsChanged) {
      scrollContainerRef.current?.scrollTo(0, 0);
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
    plantSearchData?.count === plantSearchData?.results.length;

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
          "grow overflow-auto scroll-smooth px-2 2xl:pr-8 pt-4 flex flex-col",
          plantSearchResults.length && "md:pr-4 pb-4 gap-4"
        )}
      >
        <PageTitle>Plant Search</PageTitle>
        <div
          className={classNames(
            "flex max-md:flex-col gap-4 2xl:gap-12 grow",
            !plantSearchResults.length && "md:overflow-auto scroll-smooth py-4"
          )}
        >
          <div
            id="filter-sidebar"
            className={classNames(
              "basis-1/3 md:max-w-lg md:min-w-sm",
              plantSearchResults.length
                ? "md:sticky -top-4 md:h-[calc(100dvh-2.5rem)]"
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
                  disabled={
                    searchLocationLoading ||
                    status !== "READY" ||
                    !criteriaIsChanged
                  }
                  variant="primary"
                  onClick={searchPlants}
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
              !plantSearchResults.length && "sticky top-0"
            )}
          >
            <AnimatePresence>
              <motion.div
                key="scrape-status-bar"
                className={classNames(
                  "sticky -top-4 z-20 transition-opacity",
                  plantSearchResults.length ? "opacity-100" : "opacity-0"
                )}
              >
                <ScrapeStatusBar searchRecord={searchRecordQuery.data} />
              </motion.div>

              <PlantResultsHolder
                key="results-holder"
                searchId={searchRecordQuery.data?.id}
              />

              {isShowingAllResults ||
              ["CHECKING_STATUS", "SCRAPING_AND_POLLING"].includes(status) ? (
                <PlantAnimation
                  key="plant-animation"
                  queryStatus={status}
                  isInitialSearch={!searchRecordQuery.dataUpdatedAt}
                  hasCurrentResults={Boolean(plantSearchResults.length)}
                />
              ) : (
                <LoadingIcon size={25} className="text-white mx-auto" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </PlantSearchContext.Provider>
  );
};

export default PlantSearch;
