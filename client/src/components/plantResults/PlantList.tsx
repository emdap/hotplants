import classNames from "classnames";
import ActivePlantPane from "components/plantSearch/ActivePlantPane";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import PlantCard from "./PlantCard";

const PlantList = ({ className }: { className?: string }) => {
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
          "gap-4 items-stretch grid justify-around grid-cols-[repeat(auto-fit,_minmax(300px,1fr))]",
          className,
        )}
      >
        {plantList.map((plant, index) => (
          <PlantCard
            key={`${plant.scientificName}-${index}`}
            setActive={() => {
              setActivePlantIndex(index);
              setActiveMediaIndex(0);
            }}
            isActive={activePlantIndex === index}
            plant={plant}
          />
        ))}
      </div>

      <ActivePlantPane />
    </>
  );
};

export default PlantList;
