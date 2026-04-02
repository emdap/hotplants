import { useSearch } from "@tanstack/react-router";
import classNames from "classnames";
import { useAppContext } from "contexts/AppContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
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
  const { pageSize: _pageSize, ...searchParams } = useSearch({ strict: false });
  const { sidebarExpanded } = useAppContext();
  const { scrollContainerElement } = useGetScrollContainer();

  const { plantList } = usePlantSelectionContext();

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
    <motion.div
      key={showFadeInAnimation ? JSON.stringify(searchParams) : undefined}
      {...MOTION_FADE_IN}
      className={classNames(
        "gap-4 items-stretch grid",
        {
          "justify-around": plantList.length > 3,
        },
        className,
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, ${shrinkCols ? "minmax(0, 300px)" : "minmax(300px, 1fr))"}`,
        maxWidth: plantList.length < 4 ? plantList.length * 400 : undefined,
      }}
    >
      {plantList.map((plant) => (
        <PlantCard key={`${plant._id}`} plant={plant} />
      ))}
    </motion.div>
  );
};

export default PlantList;
