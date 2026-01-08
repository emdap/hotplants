import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import PlantSearchFooter from "components/plantSearch/PlantSearchFooter";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import PlantSearchSidebar from "components/plantSearch/PlantSearchSidebar";
import {
  RESULTS_PANE_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useRef, useState } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
      <PlantSearchHeader className="max-lg:hidden bg-header border-header" />

      <div
        ref={containerRef}
        className="small-screen:page-wrapper flex max-lg:flex-col grow"
      >
        <PlantSearchSidebar
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
        />

        <PlantSearchHeader
          openSidebar={() => setSidebarExpanded(true)}
          className="lg:hidden card card-solid"
        />

        <div
          id={RESULTS_PANE_ID}
          className={classNames(
            "grow flex flex-col relative scroll-m-header-2 pt-1 px-4",
            hasCurrentResults ? "max-lg:basis-2/3 gap-6" : "pb-20"
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
