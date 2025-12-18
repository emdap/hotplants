import classNames from "classnames";
import Button from "components/designSystem/Button";
import Card from "components/designSystem/Card";
import PageTitle from "components/designSystem/PageTitle";
import MapProvider from "components/interactiveMap/MapProvider";
import LocationSearch from "components/LocationSearch";
import PlantFilters from "components/plantSearchFilters/PlantFilters";
import ActivePlantPane from "components/plantSearchResults/ActivePlantPane";
import PlantResultsFooter from "components/plantSearchResults/PlantResultsFooter";
import PlantResultsHolder from "components/plantSearchResults/PlantResultsHolder";
import ScrapeStatusBar from "components/ScrapeStatusBar";
import {
  FILTER_HOLDER_ID,
  usePlantSearchContext,
} from "contexts/PlantSearchContext";
import { PlantDataInput } from "generated/graphql/graphql";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useRef, useState } from "react";
import { HEADER_HEIGHT } from "util/generalUtil";

const FETCH_MORE_SCROLL_THRESHOLD = 100;
const RESULTS_HOLDER_ID = "results-pane";

const PlantSearch = () => {
  const {
    hasCurrentResults,
    searchLocationLoading,
    searchStatus,
    applyFilters,
    fetchNextPlantsPage,
  } = usePlantSearchContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();

  const containerRef = useRef<HTMLElement>(null);
  const [plantFilters, setPlantFilters] = useState<PlantDataInput>({});

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
    <>
      <PageTitle>Plant Search</PageTitle>

      <main
        ref={containerRef}
        className={classNames(
          "grow max-md:mr-1 px-2 flex flex-col gap-4 max-md:pb-10",
          hasCurrentResults && "md:pb-4"
        )}
      >
        <div
          className={classNames(
            "flex max-md:flex-col gap-y-6 gap-x-4 2xl:gap-x-12 grow",
            !hasCurrentResults && "pb-10"
          )}
        >
          <div
            id="filter-sidebar"
            className={classNames(
              "basis-1/3 grow md:max-w-lg lg:min-w-sm",
              hasCurrentResults
                ? "md:sticky md:h-[calc(100dvh-2.5rem)]"
                : "h-max"
            )}
            style={{ top: HEADER_HEIGHT }}
          >
            <div
              className={classNames(
                "md:h-full max-h-fit space-y-4",
                hasCurrentResults && "md:overflow-auto md:pb-24"
              )}
            >
              <Card className="flex flex-col gap-2 items-start w-full !p-2">
                <LocationSearch />
                <MapProvider
                  showAllPlants
                  className="w-full h-[200px] md:h-[300px] grow"
                />
              </Card>

              <Card id={FILTER_HOLDER_ID} className="space-y-4 scroll-m-6">
                <PlantFilters
                  plantFilters={plantFilters}
                  setPlantFilters={setPlantFilters}
                />
                <Button
                  linkAddress={`#${RESULTS_HOLDER_ID}`}
                  className="mt-auto"
                  isLoading={searchLocationLoading || searchStatus !== "READY"}
                  variant="primary"
                  onClick={() => applyFilters(plantFilters)}
                >
                  Apply filters
                </Button>
              </Card>
            </div>
          </div>

          <div
            id={RESULTS_HOLDER_ID}
            className={classNames(
              "grow flex flex-col gap-6 relative scroll-m-8",
              !hasCurrentResults && "md:sticky md:top-20 h-fit"
            )}
          >
            <ScrapeStatusBar />
            <PlantResultsHolder key="results-holder" />
            <PlantResultsFooter key="results-footer" />
          </div>
        </div>
      </main>

      <ActivePlantPane />
    </>
  );
};

export default PlantSearch;
