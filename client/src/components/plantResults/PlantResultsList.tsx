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
    <>
      <div
        className={classNames(
          "gap-4 items-stretch grid justify-around grid-cols-[repeat(auto-fit,_minmax(300px,1fr))] big-screen:pr-4",
          className,
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
              ),
          )}
        </AnimatePresence>
      </div>

      <ActivePlantPane />
    </>
  );
};

export default PlantResultsList;
