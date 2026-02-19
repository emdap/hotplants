import classNames from "classnames";
import ActivePlantPane from "components/plantSearch/ActivePlantPane";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { useSidebarContext } from "contexts/sidebar/SidebarContext";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useLayoutEffect, useState } from "react";
import PlantCard from "./PlantCard";

const PlantList = ({
  parentSidebarExpanded,
  className,
}: {
  parentSidebarExpanded?: boolean;
  className?: string;
}) => {
  const { sidebarExpanded } = useSidebarContext();
  const { scrollContainerElement } = useGetScrollContainer();

  const {
    plantList,
    activePlantIndex,
    setActivePlantIndex,
    setActiveMediaIndex,
  } = usePlantSelectionContext();

  const [shrinkCols, setShrinkCols] = useState(false);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (
        scrollContainerElement &&
        scrollContainerElement.scrollWidth > scrollContainerElement.offsetWidth
      ) {
        setShrinkCols(true);
      } else {
        setShrinkCols(false);
      }
    }, 300);
  }, [scrollContainerElement, parentSidebarExpanded, sidebarExpanded]);

  return (
    <>
      <div
        className={classNames(
          "gap-4 items-stretch grid justify-around",
          className,
        )}
        style={{
          gridTemplateColumns: `repeat(auto-fit, ${shrinkCols ? "minmax(0, 300px)" : "minmax(300px, 1fr))"}`,
        }}
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
