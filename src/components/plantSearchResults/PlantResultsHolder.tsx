import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { useDocumentListener } from "hooks/useDocumentListener";
import { useCallback, useRef } from "react";
import PlantCard from "./PlantCard";

const PlantResultsHolder = () => {
  const {
    fullScreenElement,
    plantSearchResults,
    activeIndexes: { plantIndex },
    setActiveIndexes,
  } = usePlantSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);

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
        childNode instanceof HTMLElement && childNode.focus();
      }
    },
    [plantIndex, setActiveIndexes, plantSearchResults.length]
  );

  useDocumentListener(
    "keydown",
    iteratePlants,
    !fullScreenElement && plantIndex !== null
  );

  return (
    <div key="results-list" ref={containerRef} className="flex flex-col gap-4">
      {plantSearchResults.map(
        (plant, index) =>
          plant && (
            <PlantCard
              key={`${plant.scientificName}-${index}`}
              plant={plant}
              setActive={() =>
                setActiveIndexes({ plantIndex: index, mediaIndex: null })
              }
              isActive={plantIndex === index}
            />
          )
      )}
    </div>
  );
};

export default PlantResultsHolder;
