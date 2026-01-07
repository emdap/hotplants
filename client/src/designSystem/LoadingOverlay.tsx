import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useDebounce } from "react-use";
import LoadingIcon from "./LoadingIcon";
import { MOTION_FADE_IN } from "./motionTransitions";

type LoadingOverlayProps = {
  show?: boolean;
  debounceShow?: boolean;
  size?: number;
  className?: string;
};

const LoadingOverlay = ({
  show,
  debounceShow,
  size = 50,
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
            "bg-gray-500/80 dark:bg-black/70 z-20 rounded-sm flex justify-center items-center",
            className
          )}
        >
          <LoadingIcon size={size} className="text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
