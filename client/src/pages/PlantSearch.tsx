import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import ActivePlantPane from "components/plantSearch/ActivePlantPane";
import PlantSearchFiltersHolder from "components/plantSearch/PlantSearchFiltersHolder";
import PlantResultsFooter from "components/plantSearch/PlantSearchFooter";
import ScrapeStatusBar from "components/plantSearch/ScrapeStatusBar";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useRef } from "react";
import { HEADER_HEIGHT } from "util/generalUtil";

const FETCH_MORE_SCROLL_THRESHOLD = 100;
const RESULTS_HOLDER_ID = "results-pane";

const PlantSearch = () => {
  const { hasCurrentResults, fetchNextPlantsPage } = usePlantSearchContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();

  const containerRef = useRef<HTMLElement>(null);

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
          "flex max-md:flex-col gap-y-6 gap-x-4 2xl:gap-x-12 grow px-2",
          !hasCurrentResults && "pb-10"
        )}
      >
        <div
          className={classNames(
            "basis-1/3 grow md:max-w-lg lg:min-w-sm",
            hasCurrentResults ? "md:sticky md:h-[calc(100dvh-2.5rem)]" : "h-max"
          )}
          style={{ top: HEADER_HEIGHT }}
        >
          <PlantSearchFiltersHolder />
        </div>

        <div
          id={RESULTS_HOLDER_ID}
          className={classNames(
            "grow flex flex-col gap-6 relative scroll-m-8",
            !hasCurrentResults && "md:sticky md:top-20 h-screen md:h-fit"
          )}
        >
          <ScrapeStatusBar />
          <PlantResultsList key="results-holder" />
          <PlantResultsFooter key="results-footer" />
        </div>
      </main>

      <ActivePlantPane />
    </>
  );
};

export default PlantSearch;
