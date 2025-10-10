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
  console.log("click", plant);

  console.log("Plant pane:", plant);

  return (
    <AnimatePresence>
      {plant && (
        <motion.div
          ref={paneRef}
          key="plant-pane"
          className="h-full absolute top-0"
          initial={{ right: "-100%" }}
          animate={{ right: 0 }}
          exit={{ right: "-100%", opacity: 0.7 }}
        >
          <Card className="h-full flex flex-col gap-2">
            <div onClick={onClose} className="-mt-2 cursor-pointer">
              <MdClose />
            </div>
            <motion.div
              className="flex-grow flex flex-col gap-4"
              key={plant.scientificName}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex gap-2">
                <PlantImageViewer />
                <LocationMap />
              </div>
              <PlantInfo plant={plant} />
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlantResultPane;
