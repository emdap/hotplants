import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import PlantSearchFooter from "components/plantSearch/PlantSearchFooter";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import PlantSearchSidebar from "components/plantSearch/PlantSearchSidebar";
import SearchParamsInput from "components/plantSearch/SearchParamsInput";
import {
  RESULTS_PANE_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect, useRef } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const { hasCurrentResults, totalResultsCount, fetchNextPlantsPage } =
    usePlantSearchContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();
  const ScrollAnchor = useScrollAnchor();

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
    <main className="w-full">
      <PageTitle className="page-buffer">Plant Search</PageTitle>
      {hasCurrentResults && <PlantSearchHeader />}

      <div
        ref={containerRef}
        className={classNames("flex grow", {
          "small-screen:page-buffer small-screen:flex-col small-screen:justify-between small-screen:h-full":
            hasCurrentResults,
          "max-md:flex-col max-md:justify-between page-buffer pb-8 gap-8":
            !hasCurrentResults,
        })}
      >
        {hasCurrentResults ? (
          <PlantSearchSidebar />
        ) : (
          <div className="basis-1/2 max-w-2xl">
            <SearchParamsInput />
          </div>
        )}

        <ScrollAnchor className="scroll-m-header-2" />

        <div
          id={RESULTS_PANE_ID}
          className="grow flex flex-col relative scroll-m-header-2 py-4 big-screen:px-4 max-lg:basis-2/3 gap-6"
        >
          {hasCurrentResults && (
            <PlantResultsList
              key="results-holder"
              className={classNames({
                "max-w-page": totalResultsCount < 3,
              })}
            />
          )}

          <PlantSearchFooter key="results-footer" />
        </div>
      </div>
    </main>
  );
};

export default PlantSearch;
