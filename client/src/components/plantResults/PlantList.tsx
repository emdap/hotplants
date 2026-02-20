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
    activePlantId,
    setActivePlantId: setActivePlantId,
    setActiveMediaUrl: setActiveMediaUrl,
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
        {plantList.map((plant) => (
          <PlantCard
            key={`${plant._id}`}
            setActive={() => {
              setActivePlantId(plant._id);
              setActiveMediaUrl(
                plant.thumbnailUrl ?? plant.occurrences[0].media[0].url,
              );
            }}
            isActive={activePlantId === plant._id}
            plant={plant}
          />
        ))}
      </div>

      <ActivePlantPane />
    </>
  );
};

export default PlantList;
