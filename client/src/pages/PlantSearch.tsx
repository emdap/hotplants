import classNames from "classnames";
import PlantList from "components/plantResults/PlantList";
import PlantAnimation from "components/plantSearch/PlantAnimation";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import PlantSearchSidebar from "components/plantSearch/PlantSearchSidebar";
import SearchParamsInput from "components/plantSearch/SearchParamsInput";
import SearchRecordProgressBar from "components/searchRecord/SearchRecordProgressBar";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { useLayoutEffect, useRef } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = () => {
  const {
    isInfiniteScroll,
    hasCurrentResults,
    sidebarExpanded,

    searchStatus,
    plantSearchQuery: { loading },
    searchRecordQuery,

    fetchMorePlants,
  } = usePlantSearchContext();
  const { page, lastPage } = usePlantSelectionContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();
  const ScrollAnchor = useScrollAnchor({ enabled: searchStatus === "READY" });

  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const hasNextPage = page < lastPage;

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerElement) {
        return;
      }
      if (
        hasNextPage &&
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
    hasNextPage,
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
        className={classNames("flex grow", {
          "small-screen:page-buffer small-screen:flex-col small-screen:justify-between small-screen:h-full":
            hasCurrentResults,
          "max-md:flex-col max-md:justify-between page-buffer pb-8 gap-8":
            !hasCurrentResults,
        })}
      >
        {hasCurrentResults ? (
          <>
            <PlantSearchSidebar />
            {!isInfiniteScroll && (
              <ScrollAnchor className="scroll-m-header-2" />
            )}
          </>
        ) : (
          <div className="basis-1/2 max-w-2xl min-w-md max-md:min-w-full">
            <SearchParamsInput
              onClickSearch={() =>
                setTimeout(
                  () =>
                    resultsContainerRef.current?.scrollIntoView({
                      behavior: "smooth",
                    }),
                  300,
                )
              }
            />
          </div>
        )}

        <div
          ref={resultsContainerRef}
          className="grow flex flex-col relative scroll-m-header-2 pt-4 pb-10 big-screen:px-4 max-lg:basis-2/3 gap-20"
        >
          {hasCurrentResults && (
            <PlantList
              key="results-holder"
              parentSidebarExpanded={sidebarExpanded}
              className={classNames({
                "pb-20": isInfiniteScroll && hasNextPage,
              })}
            />
          )}

          <LoadingOverlay
            transparent
            show={
              !isInfiniteScroll &&
              searchStatus !== "SCRAPING_AND_POLLING" &&
              page > 1 &&
              loading
            }
            className="h-[80vh] animate-pulse opacity-50"
          />

          {hasNextPage && searchStatus !== "CHECKING_STATUS" ? (
            isInfiniteScroll && (
              // Show loading icon when next results are loading in infinite scroll
              <div className="pb-4 mx-auto -mt-10 mb-10">
                <LoadingIcon size={25} className="text-white" />
              </div>
            )
          ) : (
            <div className="flex flex-col gap-8 my-auto h-[600px] overflow-hidden">
              <PlantAnimation
                queryStatus={searchStatus}
                isInitialSearch={!searchRecordQuery.dataUpdatedAt}
                hasCurrentResults={hasCurrentResults}
              />

              {searchRecordQuery.data && (
                <Card
                  className={classNames(
                    "mx-auto flex flex-col items-center gap-6 transition-opacity",
                    searchStatus === "READY"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none",
                  )}
                >
                  {
                    <SearchRecordProgressBar
                      hideTitle
                      {...searchRecordQuery.data}
                      status="READY"
                    />
                  }

                  {searchRecordQuery.data.status !== "COMPLETE" && (
                    <Button className="w-full" onClick={fetchMorePlants}>
                      Gather more data
                    </Button>
                  )}
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PlantSearch;
