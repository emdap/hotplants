import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import PlantSearchFiltersHolder from "components/plantSearch/PlantSearchFiltersHolder";
import PlantSearchFooter from "components/plantSearch/PlantSearchFooter";
import ScrapeStatusBar from "components/plantSearch/ScrapeStatusBar";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useRef } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;
const RESULTS_PANE_ID = "results-pane";

const PlantSearch = () => {
  const { hasCurrentResults, totalResultsCount, fetchNextPlantsPage } =
    usePlantSearchContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();

  const containerRef = useRef<HTMLDivElement>(null);

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
    <main className="page-wrapper">
      <PageTitle>Plant Search</PageTitle>

      <div
        ref={containerRef}
        className="flex max-lg:flex-col gap-y-6 gap-x-4 2xl:gap-x-12 grow"
      >
        <PlantSearchFiltersHolder />

        <div
          id={RESULTS_PANE_ID}
          className={classNames(
            "grow flex flex-col gap-6 relative scroll-m-8",
            hasCurrentResults
              ? "max-lg:basis-2/3"
              : "lg:sticky lg:top-0 big-screen:top-20 h-screen big-screen:h-fit lg:pb-20"
          )}
        >
          <ScrapeStatusBar />
          <PlantResultsList
            key="results-holder"
            className={classNames({
              "lg:pb-20": hasCurrentResults,
              "max-w-[1000px]": totalResultsCount < 3,
            })}
          />
          <PlantSearchFooter key="results-footer" />
        </div>
      </div>
    </main>
  );
};

export default PlantSearch;
