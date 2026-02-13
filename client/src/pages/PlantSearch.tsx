import classNames from "classnames";
import PlantList from "components/plantResults/PlantList";
import PlantAnimation from "components/plantSearch/PlantAnimation";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import PlantSearchSidebar from "components/plantSearch/PlantSearchSidebar";
import SearchParamsInput from "components/plantSearch/SearchParamsInput";
import {
  RESULTS_PANE_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect, useRef } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const {
    hasMoreData,
    hasCurrentResults,
    totalResultsCount,
    isInfiniteScroll,
    searchStatus,
    plantSearchQuery,
    searchRecordQuery: { dataUpdatedAt },
    fetchMorePlants,
  } = usePlantSearchContext();
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
        fetchMorePlants();
      }
    };

    isInfiniteScroll &&
      scrollContainer?.addEventListener("scroll", handleScroll);

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [
    isInfiniteScroll,
    fetchMorePlants,
    scrollContainer,
    scrollContainerElement,
  ]);

  return (
    <main className="w-full h-full">
      {!hasCurrentResults && <ScrollAnchor className="scroll-m-header-2" />}

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

        {hasCurrentResults && <ScrollAnchor className="scroll-m-header-2" />}

        <div
          id={RESULTS_PANE_ID}
          className="grow flex flex-col relative scroll-m-header-2 pt-4 pb-10 big-screen:px-4 max-lg:basis-2/3 gap-6"
        >
          {hasCurrentResults && (
            <PlantList
              key="results-holder"
              className={classNames({
                "max-w-page": totalResultsCount < 3,
                "pb-20": isInfiniteScroll,
              })}
            />
          )}

          <LoadingOverlay
            transparent
            show={!isInfiniteScroll && plantSearchQuery.loading}
            className="h-screen animate-pulse opacity-50"
          />

          {isInfiniteScroll &&
          hasMoreData &&
          searchStatus !== "CHECKING_STATUS" ? (
            <div key="loading-icon" className="pb-4 mx-auto -mt-10 mb-10">
              <LoadingIcon size={25} className="text-white" />
            </div>
          ) : (
            (isInfiniteScroll || !hasMoreData) && (
              <PlantAnimation
                key="plant-animation"
                queryStatus={searchStatus}
                isInitialSearch={!dataUpdatedAt}
                hasCurrentResults={hasCurrentResults}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default PlantSearch;
