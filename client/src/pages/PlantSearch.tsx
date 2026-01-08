import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import PlantSearchFiltersHolder from "components/plantSearch/PlantSearchFiltersHolder";
import PlantSearchFooter from "components/plantSearch/PlantSearchFooter";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import {
  RESULTS_PANE_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useRef } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

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
    <main>
      <PageTitle>Plant Search</PageTitle>
      <PlantSearchHeader className="max-lg:hidden bg-header border-header mb-4" />

      <div
        ref={containerRef}
        className="page-wrapper flex max-lg:flex-col gap-y-6 gap-x-4 2xl:gap-x-12 grow"
      >
        <PlantSearchFiltersHolder />

        <PlantSearchHeader className="lg:hidden card card-solid" />

        <div
          id={RESULTS_PANE_ID}
          className={classNames(
            "grow flex flex-col relative scroll-m-header",
            hasCurrentResults ? "max-lg:basis-2/3 gap-6" : "pb-20s"
          )}
        >
          <PlantResultsList
            key="results-holder"
            className={classNames({
              "xl:max-w-[1000px]": totalResultsCount < 3,
            })}
          />
          <PlantSearchFooter key="results-footer" />
        </div>
      </div>
    </main>
  );
};

export default PlantSearch;
