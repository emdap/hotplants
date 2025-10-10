import LocationMap from "components/LocationMap";
import Card from "designSystem/Card";
import { PlantResult } from "graphqlQueries/plantQueries";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useClickAway } from "react-use";
import PlantImageViewer from "./PlantImageViewer";
import PlantInfo from "./PlantInfo";

const PlantResultPane = ({
  plant,
  onClose,
}: {
  plant: PlantResult | null;
  onClose: () => void;
}) => {
  const paneRef = useRef<HTMLDivElement>(null);
  useClickAway(paneRef, onClose, ["mouseup"]);

  return (
    <AnimatePresence>
      {plant && (
        <motion.div
          ref={paneRef}
          key="plant-pane"
          className="h-full absolute top-0 w-full sm:max-w-3/5"
          initial={{ right: "-100%" }}
          animate={{ right: 0 }}
          exit={{ right: "-100%" }}
        >
          <Card className="h-full flex flex-col gap-2 bg-white/80! dark:bg-gray-800/80 backdrop-blur-xs">
            <div onClick={onClose} className="-mt-2 cursor-pointer">
              <MdClose />
            </div>
            <div className="flex-grow flex flex-col gap-4">
              <div className="flex gap-4 justify-between">
                <PlantImageViewer mode="carousel" plant={plant} />
                <LocationMap />
              </div>
              <PlantInfo plant={plant} />
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlantResultPane;
