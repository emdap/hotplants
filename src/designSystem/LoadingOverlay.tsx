import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import LoadingIcon from "./LoadingIcon";
import { MOTION_FADE_IN } from "./motionTransitions";

const LoadingOverlay = ({
  show,
  size = 50,
  className,
}: {
  show?: boolean;
  size?: number;
  className?: string;
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key="loading-overlay"
        {...MOTION_FADE_IN}
        className={classNames(
          "absolute h-full w-full bg-gray-500/80 dark:bg-black/70 z-20 rounded-sm flex justify-center items-center",
          className
        )}
      >
        <LoadingIcon size={size} className="text-white" />
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingOverlay;
