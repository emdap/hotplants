import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { AnimatePresence } from "motion/react";
import PlantCard from "./PlantCard";

const PlantResultsList = () => {
  const {
    plantSearchResults,
    activeIndexes: { plantIndex },
    setActiveIndexes,
  } = usePlantSearchContext();

  return (
    <div
      className={classNames(
        "gap-4 items-stretch max-md:flex flex-col md:grid justify-around grid-cols-[repeat(auto-fit,_minmax(384px,1fr))]",
        plantSearchResults.length && "md:pb-20",
        plantSearchResults.length < 3 && "max-w-[1000px]"
      )}
    >
      <AnimatePresence>
        {plantSearchResults.map(
          (plant, index) =>
            plant && (
              <PlantCard
                key={`${plant.scientificName}-${index}`}
                setActive={() =>
                  setActiveIndexes({ plantIndex: index, mediaIndex: null })
                }
                isActive={plantIndex === index}
                {...{ plant, index }}
              />
            )
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlantResultsList;
