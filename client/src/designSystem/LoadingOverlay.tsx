import classNames from "classnames";
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
};

const LoadingOverlay = ({
  show,
  debounceShow,
  iconSize = 50,
  transparent,
  className,
}: LoadingOverlayProps) => {
  const [debouncedShow, setDebouncedShow] = useState(false);
  useDebounce(() => setDebouncedShow(Boolean(show)), 1000, [show]);

  const showLoader = debounceShow ? debouncedShow : show;

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
          <LoadingIcon size={iconSize} className="text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
