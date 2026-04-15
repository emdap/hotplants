import classNames from "classnames";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import { PlantSearchQueryStatus } from "hooks/usePlantSearchQueries";
import movingPlant from "imageAssets/movingPlant.json";
import stillPlant from "imageAssets/stillPlant.json";
import { useLottie } from "lottie-react";
import { motion } from "motion/react";
import pluralize from "pluralize";
import { ReactNode, useEffect, useState } from "react";

type PlantAnimationProps = {
  customNoDataMessage?: string;
  showServerStatus?: boolean;
  queryStatus?: PlantSearchQueryStatus;
  dataType?: string;
  hasCurrentResults?: boolean;
  className?: string;
};

const getDescription = (
  serverReady: boolean | null,
  {
    showServerStatus,
    customNoDataMessage,
    queryStatus,
    dataType = "plants",
    hasCurrentResults,
  }: Partial<PlantAnimationProps>,
): { key: number; text: ReactNode; showLoader?: boolean } => {
  if (showServerStatus && serverReady === null) {
    return {
      key: -2,
      text: (
        <>
          Server not responding :(
          <br />
          You can try refreshing!
        </>
      ),
    };
  } else if (showServerStatus && !serverReady) {
    return { key: -1, text: "Waking up server", showLoader: true };
  } else if (queryStatus === "CHECKING_STATUS") {
    return { key: 0, text: "Loading", showLoader: true };
  } else if (queryStatus === "SCRAPING_AND_POLLING") {
    return {
      key: 1,
      text: `Searching for ${hasCurrentResults ? "more " : ""}${pluralize(dataType)}`,
    };
  } else if (!hasCurrentResults) {
    return {
      key: 2,
      text:
        customNoDataMessage ??
        `No ${pluralize(dataType)} found, try adjusting your filters.`,
    };
  } else {
    return { key: 3, text: "End of results" };
  }
};

const PlantAnimation = ({ className, ...props }: PlantAnimationProps) => {
  const { serverReady } = useServerReadyContext();

  const [lottieAnimation, setLottieAnimation] = useState<"STILL" | "MOVING">(
    "STILL",
  );

  const Lottie = useLottie({
    name: lottieAnimation,
    animationData: lottieAnimation === "STILL" ? stillPlant : movingPlant,
    className: "w-[200px] transition-opacity",
  });

  useEffect(() => {
    if (props.queryStatus === "CHECKING_STATUS") {
      Lottie.setSpeed(0.1);
      Lottie.setDirection(-1);
    } else {
      Lottie.setDirection(1);

      if (props.queryStatus === "SCRAPING_AND_POLLING") {
        setLottieAnimation("MOVING");
        Lottie.setSpeed(1);
      } else {
        setLottieAnimation("STILL");
        Lottie.setSpeed(0.25);
      }
    }
  }, [props.queryStatus, Lottie]);

  const { key, text, showLoader } = getDescription(serverReady, props);

  return (
    <div
      key="plant-animation"
      className={classNames(
        "grow flex flex-col gap-4 items-center justify-center transition-opacity",
        className,
      )}
    >
      <motion.div key="plant-animation" {...MOTION_FADE_IN}>
        {Lottie.View}
      </motion.div>
      <motion.h4
        key={key}
        {...MOTION_FADE_IN}
        className={classNames(
          "text-white text-center px-4 text-base big-screen:text-lg min-h-fit flex gap-3 items-center",
          lottieAnimation === "MOVING" && "animate-pulse",
        )}
      >
        {showLoader && <LoadingIcon />}
        {text}
      </motion.h4>
    </div>
  );
};

export default PlantAnimation;
