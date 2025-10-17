import classNames from "classnames";
import Card from "designSystem/Card";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { useDocumentListener } from "hooks/useDocumentListener";
import { useCallback, useMemo, useRef, useState } from "react";
import PlantImageViewer from "./PlantImageViewer";
import PlantInfo from "./PlantInfo";
import PlantResultPane from "./PlantResultPane";

const PlantSearchResults = ({
  searchResults,
}: {
  searchResults: PlantQueryResults;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activePlantIndex, setActivePlantIndex] = useState<null | number>(null);
  const activePlant = useMemo(
    () => (activePlantIndex === null ? null : searchResults[activePlantIndex]),
    [searchResults, activePlantIndex]
  );

  const iteratePlants = useCallback(
    (e: KeyboardEvent) => {
      if (activePlantIndex === null) {
        return;
      }

      let newActiveIndex: null | number = null;
      if (e.code === "ArrowUp" && activePlantIndex !== 0) {
        newActiveIndex = activePlantIndex - 1;
      } else if (
        e.code === "ArrowDown" &&
        activePlantIndex < searchResults.length - 1
      ) {
        newActiveIndex = activePlantIndex + 1;
      }

      if (newActiveIndex !== null) {
        e.preventDefault();
        setActivePlantIndex(newActiveIndex);
        const childNode = containerRef.current?.childNodes[newActiveIndex];
        childNode instanceof HTMLElement && childNode.scrollIntoView();
      }
    },
    [activePlantIndex, setActivePlantIndex, searchResults.length]
  );

  useDocumentListener("keydown", iteratePlants, activePlantIndex !== null);

  return (
    <>
      <div
        ref={containerRef}
        className="space-y-4 flex-grow overflow-auto p-2 relative scroll-smooth"
      >
        {searchResults.map(
          (plant, index) =>
            plant && (
              <Card
                key={plant.scientificName}
                id={plant.scientificName}
                onClick={() => setActivePlantIndex(index)}
                className={classNames("flex gap-2 cursor-pointer h-40", {
                  "bg-secondary/20!": activePlantIndex === index,
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
        onClose={() => setActivePlantIndex(null)}
      />
    </>
  );
};

export default PlantSearchResults;
