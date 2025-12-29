import MapProvider from "components/interactiveMap/MapProvider";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
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
  const {
    plantList,
    activePlantIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const activePlant = useMemo(() => {
    return activePlantIndex === null
      ? null
      : plantList[activePlantIndex] ?? null;
  }, [plantList, activePlantIndex]);

  const resetActivePlant = () => {
    setActivePlantIndex(null);
    setActiveMediaIndex(null);
  };

  const paneRef = useRef<HTMLDivElement>(null);
  useClickAway(paneRef, () => !imageModalOpen && resetActivePlant(), [
    "mouseup",
  ]);

  const closeOnEscape = (e: KeyboardEvent) =>
    e.code === "Escape" && resetActivePlant();
  useDocumentListener("keyup", closeOnEscape, !!activePlant && !imageModalOpen);

  return (
    <AnimatePresence>
      {activePlant && (
        <Card
          key="plant-pane"
          ref={paneRef}
          className="backdrop-blur-2xl max-md:rounded-l-none rounded-r-none h-full w-full fixed top-0 md:w-4/7 md:max-w-5xl flex flex-col z-20 p-0 overflow-hidden"
          {...CARD_FADE_IN}
        >
          <h2 className="flex gap-4 items-center pt-2 px-2">
            <Button
              variant="icon-white"
              onClick={resetActivePlant}
              icon={<MdClose size={24} />}
            />
            {activePlant.commonNames?.[0] ?? activePlant.scientificName}
          </h2>
          <div
            key={activePlant.scientificName}
            className="flex flex-col overflow-auto lg:overflow-hidden gap-4 p-6"
          >
            <div className="flex max-lg:flex-col-reverse gap-4 justify-between">
              <PlantImageViewer
                mode="carousel"
                plant={activePlant}
                isModalOpen={imageModalOpen}
                setIsModalOpen={setImageModalOpen}
              />
              <MapProvider className="min-h-60 w-full" showMarkers />
            </div>
            <PlantInfoCard plant={activePlant} />
          </div>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default ActivePlantPane;
