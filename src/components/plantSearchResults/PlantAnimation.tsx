import classNames from "classnames";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { useLottie } from "lottie-react";
import movingPlant from "lottieFiles/movingPlant.json";
import stillPlant from "lottieFiles/stillPlant.json";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

const PlantAnimation = ({
  isLoading,
  hasBeenSearched,
  currentResultsLength,
}: {
  isLoading: boolean;
  hasBeenSearched: boolean;
  currentResultsLength: number;
}) => {
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  useDebounce(() => setDebouncedLoading(isLoading), 1000, [isLoading]);

  const Lottie = useLottie({
    animationData: debouncedLoading ? movingPlant : stillPlant,
    className: "flex basis-1 grow overflow-hidden",
  });

  useEffect(() => {
    if (debouncedLoading !== isLoading) {
      Lottie.setSpeed(0.1);
      isLoading && Lottie.setDirection(-1);
    } else if (!debouncedLoading) {
      Lottie.setSpeed(0.25);
    }
  }, [debouncedLoading, isLoading, Lottie]);

  const description = isLoading
    ? currentResultsLength
      ? "Searching for more plants"
      : "Searching for plants"
    : hasBeenSearched
    ? "No plants found, try adjusting your filters."
    : "Search for some plants to get started!";

  return (
    <motion.div
      {...MOTION_FADE_IN}
      className={classNames(
        "grow min-h-[400px] md:h-full basis-1",
        "flex flex-col gap-10 pb-10 my-auto items-center relative"
      )}
    >
      <div className="flex flex-col w-full grow basis-1 my-auto items-center">
        {Lottie.View}
      </div>
      <h4 className="text-white text-center px-4">{description}</h4>
    </motion.div>
  );
};

export default PlantAnimation;
