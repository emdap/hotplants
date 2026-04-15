import classNames from "classnames";
import PlantAnimation from "components/PlantAnimation";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useDebounce } from "react-use";
import LoadingIcon from "./LoadingIcon";
import { MOTION_FADE_IN } from "./motionTransitions";

type LoadingOverlayProps = {
  show?: boolean;
  debounceShow?: boolean;
  iconSize?: number;
  transparent?: boolean;
  className?: string;
  showServerStatus?: boolean;
  disableAnimationFallback?: boolean;
};

const LoadingOverlay = ({
  show,
  debounceShow,
  iconSize = 50,
  transparent,
  className,
  showServerStatus,
  disableAnimationFallback,
}: LoadingOverlayProps) => {
  const { serverReady } = useServerReadyContext();

  const [debouncedShow, setDebouncedShow] = useState(false);
  useDebounce(() => setDebouncedShow(Boolean(show)), 1000, [show]);

  const showLoader =
    (!serverReady && showServerStatus) || (debounceShow ? debouncedShow : show);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          key="loading-overlay"
          {...MOTION_FADE_IN}
          className={classNames(
            "rounded-sm flex justify-center items-center min-h-full w-full",
            {
              "opacity-50": transparent,
              "bg-gray-500/80 dark:bg-black/70": !transparent,
            },
            className,
          )}
        >
          {serverReady || disableAnimationFallback ? (
            <LoadingIcon size={iconSize} className="text-white" />
          ) : (
            <PlantAnimation showServerStatus />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
