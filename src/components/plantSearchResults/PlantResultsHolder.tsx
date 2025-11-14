import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import {
  mergeMotionProps,
  MOTION_FADE_IN,
  MOTION_SLIDE_UP,
} from "designSystem/motionTransitions";
import { useDocumentListener } from "hooks/useDocumentListener";
import { motion } from "motion/react";
import { useCallback, useMemo, useRef } from "react";
import PlantImageViewer from "./PlantImageCarousel";
import PlantInfo from "./PlantInfo";
import PlantResultPane from "./PlantResultPane";

const PlantResultsHolder = ({ searchId }: { searchId?: string }) => {
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

  return (
    <>
      {" "}
      {searchId && (
        <motion.div
          key="results-list"
          {...MOTION_FADE_IN}
          ref={containerRef}
          className="flex flex-col gap-2 lg:gap-4"
        >
          {plantSearchResults.map(
            (plant, index) =>
              plant && (
                <Card
                  {...mergeMotionProps(MOTION_FADE_IN, MOTION_SLIDE_UP)}
                  key={`${plant.scientificName}-${index}-${searchId}`}
                  id={plant.scientificName}
                  onClick={() =>
                    setActiveIndexes({ plantIndex: index, mediaIndex: null })
                  }
                  className={classNames(
                    "flex gap-2 cursor-pointer h-40 scroll-mt-20",
                    {
                      "!bg-default-background dark:!bg-default-background/50":
                        plantIndex === index,
                    }
                  )}
                >
                  {index}
                  <PlantImageViewer mode="thumbnail" plant={plant} />
                  <PlantInfo plant={plant} />
                </Card>
              )
          )}
        </motion.div>
      )}
      <PlantResultPane
        plant={activePlant}
        onClose={() => setActiveIndexes({ plantIndex: null, mediaIndex: null })}
      />
    </>
  );
};

export default PlantResultsHolder;
