import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { AnimatePresence } from "motion/react";
import PlantCard from "./PlantCard";

const PlantResultsList = () => {
  const { plantList, activePlantIndex, setActivePlantIndex } =
    usePlantSelectionContext();

  return (
    <div
      className={classNames(
        "gap-4 items-stretch max-md:flex flex-col md:grid justify-around grid-cols-[repeat(auto-fit,_minmax(384px,1fr))]",
        plantList.length && "md:pb-20",
        plantList.length < 3 && "max-w-[1000px]"
      )}
    >
      <AnimatePresence>
        {plantList.map(
          (plant, index) =>
            plant && (
              <PlantCard
                key={`${plant.scientificName}-${index}`}
                setActive={() => setActivePlantIndex(index)}
                isActive={activePlantIndex === index}
                {...{ plant, index }}
              />
            )
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlantResultsList;
