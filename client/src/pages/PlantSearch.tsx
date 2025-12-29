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
const RESULTS_HOLDER_ID = "results-pane";

const PlantSearch = () => {
  const { hasCurrentResults, totalResultsCount, fetchNextPlantsPage } =
    usePlantSearchContext();
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
        <PlantSearchFiltersHolder />

        <div
          id={RESULTS_HOLDER_ID}
          className={classNames(
            "grow flex flex-col gap-6 relative scroll-m-8",
            hasCurrentResults
              ? "max-lg:basis-2/3"
              : "md:sticky md:top-20 h-screen md:h-fit md:pb-20"
          )}
        >
          <ScrapeStatusBar />
          <PlantResultsList
            key="results-holder"
            className={classNames({
              "md:pb-20": hasCurrentResults,
              "max-w-[1000px]": totalResultsCount < 3,
            })}
          />
          <PlantSearchFooter key="results-footer" />
        </div>
      </main>
    </>
  );
};

export default PlantSearch;
