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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { isSmallScreen } from "util/generalUtil";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(!isSmallScreen());

  const { hasCurrentResults, totalResultsCount, fetchNextPlantsPage } =
    usePlantSearchContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggleSidebar = () => setSidebarExpanded(!isSmallScreen());

    window.addEventListener("resize", toggleSidebar);
    return () => window.removeEventListener("resize", toggleSidebar);
  }, []);

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
      <PageTitle className={hasCurrentResults ? "mx-0" : "page-wrapper"}>
        Plant Search
      </PageTitle>
      {hasCurrentResults && (
        <PlantSearchHeader openSidebar={() => setSidebarExpanded(true)} />
      )}
      <div
        ref={containerRef}
        className={classNames("flex grow", {
          "small-screen:page-wrapper small-screen:flex-col small-screen:justify-between small-screen:h-full":
            hasCurrentResults,
          "page-wrapper px-4 max-md:flex-col max-md:justify-between":
            !hasCurrentResults,
        })}
      >
        {hasCurrentResults ? (
          <PlantSearchSidebar
            isExpanded={sidebarExpanded}
            setIsExpanded={setSidebarExpanded}
          />
        ) : (
          <div className="basis-1/2 max-w-2xl">
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
