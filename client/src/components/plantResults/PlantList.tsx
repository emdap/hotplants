import classNames from "classnames";
import ActivePlantPane from "components/plantResults/ActivePlantPane";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { useSidebarContext } from "contexts/sidebar/SidebarContext";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { motion } from "motion/react";
import { useLayoutEffect, useState } from "react";
import PlantCard from "./PlantCard";

const PlantList = ({
  showFadeInAnimation,
  parentSidebarExpanded,
  className,
}: {
  showFadeInAnimation?: boolean;
  parentSidebarExpanded?: boolean;
  className?: string;
}) => {
  const { sidebarExpanded } = useSidebarContext();
  const { scrollContainerElement } = useGetScrollContainer();

  const { page, plantList } = usePlantSelectionContext();

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
      <motion.div
        key={showFadeInAnimation ? page : undefined}
        {...MOTION_FADE_IN}
        className={classNames(
          "gap-4 items-stretch grid",
          {
            "justify-around": plantList.length > 3,
            "sm:grid-cols-3 max-w-page": plantList.length <= 3,
          },
          className,
        )}
        style={
          plantList.length > 3
            ? {
                gridTemplateColumns: `repeat(auto-fit, ${shrinkCols ? "minmax(0, 300px)" : "minmax(300px, 1fr))"}`,
              }
            : undefined
        }
      >
        {plantList.map((plant) => (
          <PlantCard key={`${plant._id}`} plant={plant} />
        ))}
      </motion.div>

      <ActivePlantPane />
    </>
  );
};

export default PlantList;
