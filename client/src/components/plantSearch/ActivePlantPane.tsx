import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import {
  mergeMotionProps,
  MOTION_FADE_IN,
} from "designSystem/motionTransitions";
import { useDocumentListener } from "hooks/useDocumentListener";
import { AnimatePresence } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useClickAway } from "react-use";
import PlantImageViewer from "../plantImages/PlantImageViewer";
import PlantInfoCard from "../plantResults/PlantInfoCard";

const CARD_FADE_IN = mergeMotionProps(MOTION_FADE_IN, {
  initial: { right: "-100%" },
  animate: { right: 0 },
  exit: { right: "-100%" },
});

const ActivePlantPane = () => {
  const { plantSearchResults, activeIndexes, setActiveIndexes } =
    usePlantSearchContext();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const activePlant = useMemo(() => {
    return activeIndexes.plantIndex === null
      ? null
      : plantSearchResults[activeIndexes.plantIndex] ?? null;
  }, [plantSearchResults, activeIndexes.plantIndex]);

  const resetActivePlant = () =>
    setActiveIndexes({ plantIndex: null, mediaIndex: null });

  const paneRef = useRef<HTMLDivElement>(null);
  useClickAway(paneRef, () => !imageModalOpen && resetActivePlant(), [
    "mouseup",
  ]);

  const closeOnEscape = (e: KeyboardEvent) =>
    e.code === "Escape" && resetActivePlant();
  useDocumentListener("keydown", closeOnEscape, !!activePlant);

  return (
    <>
      <AnimatePresence>
        {activePlant && (
          <Card
            key="plant-pane"
            ref={paneRef}
            className="backdrop-blur-2xl max-md:rounded-l-none rounded-r-none h-full w-full fixed top-0 md:w-3/7 md:max-w-5xl flex flex-col gap-2 overflow-auto z-20"
            {...CARD_FADE_IN}
          >
            <Button
              variant="primary"
              onClick={resetActivePlant}
              className="-mt-2 cursor-pointer"
            >
              <MdClose />
            </Button>
            <div
              key={activePlant.scientificName}
              className="grow flex flex-col md:overflow-hidden gap-4"
            >
              {/* <div className="flex max-sm:flex-col gap-4 justify-between"> */}
              <PlantImageViewer
                mode="carousel"
                plant={activePlant}
                isModalOpen={imageModalOpen}
                setIsModalOpen={setImageModalOpen}
              />
              {/* <MapProvider className="min-h-60 w-full" /> */}
              {/* </div> */}
              <PlantInfoCard plant={activePlant} showFullInfo />
            </div>
          </Card>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActivePlantPane;
