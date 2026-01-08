import classNames from "classnames";
import { useDisableHtmlScroll } from "hooks/useDisableHtmlScroll";
import { AnimatePresence, motion } from "motion/react";
import { CommonMotionDivProps } from "util/generalUtil";
import { MOTION_FADE_IN } from "./motionTransitions";

const OverlayMask = ({
  show = true,
  className,
  ...props
}: CommonMotionDivProps & { show?: boolean }) => {
  useDisableHtmlScroll(show);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={classNames(
            className,
            "fixed top-0 left-0 h-dvh w-dvw bg-black/60 backdrop-blur-2xl z-50"
          )}
          {...MOTION_FADE_IN}
          {...props}
        />
      )}
    </AnimatePresence>
  );
};

export default OverlayMask;
