import classNames from "classnames";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { PlantSearchQueryStatus } from "hooks/usePlantSearchQueries";
import { useLottie } from "lottie-react";
import movingPlant from "lottieFiles/movingPlant.json";
import stillPlant from "lottieFiles/stillPlant.json";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type PlantAnimationProps = {
  queryStatus: PlantSearchQueryStatus;
  isInitialSearch: boolean;
  hasCurrentResults: boolean;
};

const getDescription = (args: Partial<PlantAnimationProps>) => {
  if (args.queryStatus === "CHECKING_STATUS") {
    return [0, ""];
  } else if (args.queryStatus === "SCRAPING_AND_POLLING") {
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
  queryStatus,
  isInitialSearch,
  hasCurrentResults,
}: PlantAnimationProps) => {
  const [lottieAnimation, setLottieAnimation] = useState<"STILL" | "MOVING">(
    "STILL"
  );

  const Lottie = useLottie({
    name: lottieAnimation,
    animationData: lottieAnimation === "STILL" ? stillPlant : movingPlant,
    className: "w-[200px] md:w-[300px] transition-opacity",
  });

  useEffect(() => {
    if (queryStatus === "CHECKING_STATUS") {
      Lottie.setSpeed(0.1);
      Lottie.setDirection(-1);
    } else {
      Lottie.setDirection(1);

      if (queryStatus === "SCRAPING_AND_POLLING") {
        setLottieAnimation("MOVING");
        Lottie.setSpeed(1);
      } else {
        setLottieAnimation("STILL");
        Lottie.setSpeed(0.25);
      }
    }
  }, [queryStatus, Lottie]);

  const [descriptionKey, description] = getDescription({
    queryStatus: queryStatus,
    hasCurrentResults,
    isInitialSearch,
  });

  return (
    <motion.div
      {...MOTION_FADE_IN}
      className="grow flex flex-col gap-10 pb-10 my-auto items-center justify-center transition-opacity"
    >
      {Lottie.View}
      <motion.h4
        key={descriptionKey}
        {...MOTION_FADE_IN}
        className={classNames(
          "text-white text-center px-4 h-8",
          lottieAnimation === "MOVING" && "animate-pulse"
        )}
      >
        {description || <LoadingIcon />}
      </motion.h4>
    </motion.div>
  );
};

export default PlantAnimation;
