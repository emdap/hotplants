import classNames from "classnames";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { useLottie } from "lottie-react";
import movingPlant from "lottieFiles/movingPlant.json";
import stillPlant from "lottieFiles/stillPlant.json";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

type PlantAnimationProps = {
  isLoading: boolean;
  isScraping: boolean;
  isInitialSearch: boolean;
  hasCurrentResults: boolean;
};

const getDescription = (args: Partial<PlantAnimationProps>) => {
  if (args.isScraping) {
    return [1, `Searching for ${args.hasCurrentResults ? "more " : ""}plants`];
  } else if (args.isInitialSearch) {
    return [2, "Search for some plants to get started!"];
  } else if (!args.hasCurrentResults) {
    return [3, "No plants found, try adjusting your filters."];
  } else {
    return [4, "End of results"];
  }
};

const PlantAnimation = ({
  isLoading,
  isScraping,
  isInitialSearch,
  hasCurrentResults,
}: PlantAnimationProps) => {
  const [debouncedScraping, setDebouncedScraping] = useState(false);
  useDebounce(() => setDebouncedScraping(isScraping), 500, [isScraping]);
  const isProcessing = isLoading && !isScraping;

  const Lottie = useLottie({
    animationData: debouncedScraping ? movingPlant : stillPlant,
    className: "w-[200px] md:w-[300px] lg:w-[400px]",
  });

  useEffect(() => {
    if (debouncedScraping !== isScraping) {
      Lottie.setSpeed(0.1);
      isScraping && Lottie.setDirection(-1);
    } else if (!debouncedScraping) {
      Lottie.setSpeed(0.25);
    } else {
      Lottie.setSpeed(1);
    }
  }, [debouncedScraping, isScraping, Lottie]);

  const [descriptionKey, description] = isProcessing
    ? [0, ""]
    : getDescription({ isScraping, hasCurrentResults, isInitialSearch });

  return (
    <motion.div
      {...MOTION_FADE_IN}
      className="transition-opacity grow flex flex-col gap-10 pb-10 my-auto items-center justify-center"
    >
      {Lottie.View}
      <motion.h4
        key={descriptionKey}
        {...MOTION_FADE_IN}
        className={classNames(
          "text-white text-center px-4 h-8",
          isScraping && "animate-pulse"
        )}
      >
        {description || <LoadingIcon />}
      </motion.h4>
    </motion.div>
  );
};

export default PlantAnimation;
