import classNames from "classnames";
import PlantAnimation from "components/PlantAnimation";
import ActivePlantPane from "components/plantResults/ActivePlantPane";
import PlantList from "components/plantResults/PlantList";
import PlantSearchForm from "components/plantSearch/PlantSearchFormSidebar";
import PlantSearchHeader from "components/plantSearch/PlantSearchHeader";
import SearchRecordProgressBar from "components/searchHistory/SearchRecordProgressBar";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useScrollAnchor } from "hooks/useScrollAnchor";
import { Ref, useLayoutEffect } from "react";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantSearch = ({
  resultsContainerRef,
}: {
  resultsContainerRef: Ref<HTMLDivElement>;
}) => {
  const {
    hasCurrentResults,

    isInfiniteScroll,
    searchFormState,

    searchStatus,
    plantSearchQuery: { loading },
    searchRecordQuery,

    fetchMorePlants,
  } = usePlantSearchContext();
  const { page, lastPage, totalItems } = usePlantSelectionContext();
  const { scrollContainer, scrollContainerElement } = useGetScrollContainer();
  const ScrollAnchor = useScrollAnchor({ enabled: searchStatus === "READY" });

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

  const showLoader =
    (loading || (isInfiniteScroll && hasNextPage)) && searchStatus === "READY";
  const showPlantAnimation =
    searchStatus !== "READY" || (!loading && !hasNextPage);

  return (
    <main className="w-full h-full">
      {!page && <ScrollAnchor id="plant" className="absolute top-0" />}
      <PageTitle className="page-buffer">Plant Search</PageTitle>
      <PlantSearchHeader />

      <div className="flex grow small-screen:page-buffer small-screen:flex-col small-screen:justify-between small-screen:h-full">
        <PlantSearchForm />

        {page && !isInfiniteScroll && (
          <ScrollAnchor className="scroll-m-header-2" />
        )}

        <div
          ref={resultsContainerRef}
          className="grow flex flex-col relative scroll-m-header-2 pt-4 pb-10 big-screen:px-4 max-lg:basis-2/3 gap-20"
        >
          <PlantList
            key="results-holder"
            parentSidebarExpanded={searchFormState.isOpen}
            showFadeInAnimation={!isInfiniteScroll}
            className={classNames({
              "pb-20": isInfiniteScroll && hasNextPage,
            })}
          />

          <ActivePlantPane />

          <LoadingOverlay
            className={classNames(
              "grow h-full min-h-[unset]! small-screen:h-dvh-header-2",
              {
                "-mt-10 pb-10": isInfiniteScroll,
              },
            )}
            iconSize={isInfiniteScroll ? 25 : undefined}
            transparent
            show={showLoader}
          />

          {showPlantAnimation && (
            <div className="flex flex-col gap-8 my-auto overflow-hidden">
              <PlantAnimation
                queryStatus={searchStatus}
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
                  <SearchRecordProgressBar
                    hideTitle
                    {...searchRecordQuery.data}
                    totalGraphQlResults={totalItems}
                  />

                  {searchRecordQuery.data.status === "READY" && (
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
