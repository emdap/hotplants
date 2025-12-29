import classNames from "classnames";
import ActivePlantPane from "components/plantSearch/ActivePlantPane";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { AnimatePresence } from "motion/react";
import PlantCard from "./PlantCard";

const PlantResultsList = ({ className }: { className?: string }) => {
  const {
    plantList,
    activePlantIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  return (
    <div
      className={classNames(
        "gap-4 items-stretch max-md:flex flex-col md:grid justify-around grid-cols-[repeat(auto-fit,_minmax(384px,1fr))]",
        className
      )}
    >
      <AnimatePresence>
        {plantList.map(
          (plant, index) =>
            plant && (
              <PlantCard
                key={`${plant.scientificName}-${index}`}
                setActive={() => {
                  setActivePlantIndex(index);
                  setActiveMediaIndex(0);
                }}
                isActive={activePlantIndex === index}
                {...{ plant, index }}
              />
            )
        )}
      </AnimatePresence>

      <ActivePlantPane />
    </div>
  );
};

export default PlantResultsList;
