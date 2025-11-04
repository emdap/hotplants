import MapProvider from "components/interactiveMap/MapProvider";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { CUSTOM_MOTION_FADE_IN } from "designSystem/motionTransitions";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useDocumentListener } from "hooks/useDocumentListener";
import { AnimatePresence } from "motion/react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useClickAway } from "react-use";
import PlantImageViewer from "./PlantImageCarousel";
import PlantInfo from "./PlantInfo";

const CARD_FADE_IN = CUSTOM_MOTION_FADE_IN({
  initial: { right: "-100%" },
  animate: { right: 0 },
  exit: { right: "-100%" },
});

const PlantResultPane = ({
  plant,
  onClose,
}: {
  plant: PlantResult | null;
  onClose: () => void;
}) => {
  const paneRef = useRef<HTMLDivElement>(null);
  useClickAway(paneRef, onClose, ["mouseup"]);

  const closeOnEscape = (e: KeyboardEvent) => e.code === "Escape" && onClose();
  useDocumentListener("keydown", closeOnEscape, !!plant);

  return (
    <AnimatePresence>
      {plant && (
        <Card
          key="plant-pane"
          className="h-full w-full absolute top-0 sm:max-w-3/5 flex flex-col overflow-hidden gap-2 !bg-default-background/80 dark:!bg-gray-800/80 backdrop-blur-xs"
          {...CARD_FADE_IN}
        >
          <Button onClick={onClose} className="-mt-2 cursor-pointer">
            <MdClose />
          </Button>
          <div
            key={plant.scientificName}
            className="flex-grow flex flex-col overflow-hidden gap-4"
          >
            <div className="flex gap-4 justify-between">
              <PlantImageViewer mode="carousel" plant={plant} />
              <MapProvider className="min-h-60 w-full" />
            </div>
            <PlantInfo plant={plant} showFullInfo />
          </div>
        </Card>
      )}
    </AnimatePresence>
  );
};

export default PlantResultPane;
