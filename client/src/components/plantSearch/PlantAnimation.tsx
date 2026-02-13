import classNames from "classnames";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { PlantSearchQueryStatus } from "hooks/usePlantSearchQueries";
import { useLottie } from "lottie-react";
import { motion } from "motion/react";
import movingPlant from "placeholderImages/movingPlant.json";
import stillPlant from "placeholderImages/stillPlant.json";
import { useEffect, useState } from "react";

type PlantAnimationProps = {
  queryStatus: PlantSearchQueryStatus;
  isInitialSearch: boolean;
  hasCurrentResults: boolean;
};

const getDescription = ({
  queryStatus,
  hasCurrentResults,
  isInitialSearch,
}: Partial<PlantAnimationProps>) => {
  if (queryStatus === "CHECKING_STATUS") {
    return [0, ""];
  } else if (queryStatus === "SCRAPING_AND_POLLING") {
    return [1, `Searching for ${hasCurrentResults ? "more " : ""}plants`];
  } else if (!hasCurrentResults && isInitialSearch) {
    return [2, "Set a location to get started!"];
  } else if (!hasCurrentResults) {
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
    "STILL",
  );

  const Lottie = useLottie({
    name: lottieAnimation,
    animationData: lottieAnimation === "STILL" ? stillPlant : movingPlant,
    className: classNames("w-[200px] max-h-3/4 transition-opacity", {
      "xl:w-[300px]": hasCurrentResults,
    }),
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
    queryStatus,
    hasCurrentResults,
    isInitialSearch,
  });

  return (
    <motion.div
      {...MOTION_FADE_IN}
      className={classNames(
        "grow flex flex-col gap-4 my-auto items-center justify-center transition-opacity",
        hasCurrentResults ? "big-screen:pb-20" : "lg:sticky lg:bottom-0",
      )}
    >
      {Lottie.View}
      <motion.h4
        key={descriptionKey}
        {...MOTION_FADE_IN}
        className={classNames(
          "text-white text-center px-4 text-base big-screen:text-lg min-h-fit",
          lottieAnimation === "MOVING" && "animate-pulse",
        )}
      >
        {description || <LoadingIcon />}
      </motion.h4>
    </motion.div>
  );
};

export default PlantAnimation;
