import classNames from "classnames";
import PlantResultsList from "components/plantResults/PlantResultsList";
import LocationSearchCard from "components/plantSearch/LocationSearchCard";
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
      {hasCurrentResults && (
        <PlantSearchHeader
          openSidebar={() => setSidebarExpanded(true)}
          className="lg:bg-header lg:border-header max-lg:card max-lg:card-solid max-lg:mx-2 max-lg:py-1"
        />
      )}
      <div
        ref={containerRef}
        className="small-screen:page-wrapper flex max-lg:flex-col max-lg:justify-between max-lg:h-full grow"
      >
        {hasCurrentResults ? (
          <PlantSearchSidebar
            isExpanded={sidebarExpanded}
            setIsExpanded={setSidebarExpanded}
          />
        ) : (
          <div className="lg:ml-8">
            <LocationSearchCard />
          </div>
        )}

        <div
          id={RESULTS_PANE_ID}
          className="grow flex flex-col relative scroll-m-header-2 py-4 px-4 max-lg:basis-2/3 gap-6"
        >
          {hasCurrentResults && (
            <PlantResultsList
              key="results-holder"
              className={classNames({
                "xl:max-w-[1000px]": totalResultsCount < 3,
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
