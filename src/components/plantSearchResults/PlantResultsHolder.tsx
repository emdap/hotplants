import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import { getScrollParent } from "helpers/util";
import { useDocumentListener } from "hooks/useDocumentListener";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import PlantImageViewer from "./PlantImageCarousel";
import PlantInfo from "./PlantInfo";
import PlantResultPane from "./PlantResultPane";

const FETCH_MORE_SCROLL_THRESHOLD = 100;

const PlantResultsHolder = ({
  fetchMorePlants,
}: {
  fetchMorePlants: () => void;
}) => {
  const {
    fullScreenElement,
    plantSearchResults,
    activeIndexes: { plantIndex },
    setActiveIndexes,
  } = usePlantSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const activePlant = useMemo(
    () => (plantIndex === null ? null : plantSearchResults[plantIndex]),
    [plantSearchResults, plantIndex]
  );

  const iteratePlants = useCallback(
    (e: KeyboardEvent) => {
      if (plantIndex === null) {
        return;
      }

      let newActiveIndex: null | number = null;
      if (e.code === "ArrowUp" && plantIndex !== 0) {
        newActiveIndex = plantIndex - 1;
      } else if (
        e.code === "ArrowDown" &&
        plantIndex < plantSearchResults.length - 1
      ) {
        newActiveIndex = plantIndex + 1;
      }

      if (newActiveIndex !== null) {
        e.preventDefault();
        setActiveIndexes({ plantIndex: newActiveIndex, mediaIndex: null });
        const childNode = containerRef.current?.childNodes[newActiveIndex];
        childNode instanceof HTMLElement && childNode.scrollIntoView();
      }
    },
    [plantIndex, setActiveIndexes, plantSearchResults.length]
  );

  useDocumentListener(
    "keydown",
    iteratePlants,
    !fullScreenElement && plantIndex !== null
  );

  useLayoutEffect(() => {
    const scrollContainer = getScrollParent(containerRef.current);
    const handleScroll = () => {
      if (!scrollContainer) {
        return;
      }
      if (
        scrollContainer.scrollHeight -
          (scrollContainer.scrollTop + scrollContainer.clientHeight) <=
        FETCH_MORE_SCROLL_THRESHOLD
      ) {
        fetchMorePlants();
      }
    };

    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, [fetchMorePlants]);

  return (
    <>
      <div ref={containerRef} className="space-y-2 lg:space-y-4 flex-grow">
        {plantSearchResults.map(
          (plant, index) =>
            plant && (
              <Card
                key={plant.scientificName}
                id={plant.scientificName}
                onClick={() =>
                  setActiveIndexes({ plantIndex: index, mediaIndex: null })
                }
                className={classNames("flex gap-2 cursor-pointer h-40", {
                  "bg-default-background/90! dark:bg-default-background/50!":
                    plantIndex === index,
                })}
              >
                <PlantImageViewer mode="thumbnail" plant={plant} />
                <PlantInfo plant={plant} />
              </Card>
            )
        )}
      </div>

      <PlantResultPane
        plant={activePlant}
        onClose={() => setActiveIndexes({ plantIndex: null, mediaIndex: null })}
      />
    </>
  );
};

export default PlantResultsHolder;
