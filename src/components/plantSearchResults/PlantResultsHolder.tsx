import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import { useDocumentListener } from "hooks/useDocumentListener";
import { useCallback, useMemo, useRef } from "react";
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
    activePlantIndexes: { plantIndex },
    setActivePlantIndexes,
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
        setActivePlantIndexes({ plantIndex: newActiveIndex, mediaIndex: null });
        const childNode = containerRef.current?.childNodes[newActiveIndex];
        childNode instanceof HTMLElement && childNode.scrollIntoView();
      }
    },
    [plantIndex, setActivePlantIndexes, plantSearchResults.length]
  );

  useDocumentListener(
    "keydown",
    iteratePlants,
    !fullScreenElement && plantIndex !== null
  );

  const handleContainerScroll = () => {
    const scrollContainer = containerRef.current;
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

  return (
    <>
      <div
        ref={containerRef}
        className="space-y-4 flex-grow overflow-auto p-2 relative scroll-smooth"
        onScroll={handleContainerScroll}
      >
        {plantSearchResults.map(
          (plant, index) =>
            plant && (
              <Card
                key={plant.scientificName}
                id={plant.scientificName}
                onClick={() =>
                  setActivePlantIndexes({ plantIndex: index, mediaIndex: null })
                }
                className={classNames("flex gap-2 cursor-pointer h-40", {
                  "bg-secondary/20!": plantIndex === index,
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
        onClose={() =>
          setActivePlantIndexes({ plantIndex: null, mediaIndex: null })
        }
      />
    </>
  );
};

export default PlantResultsHolder;
