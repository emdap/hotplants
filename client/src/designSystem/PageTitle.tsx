import classNames from "classnames";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { MOTION_FADE_IN } from "./motionTransitions";

const PageTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.h1
    className={classNames("py-6 dark:text-white/80", className)}
    {...MOTION_FADE_IN}
  >
    {children}
  </motion.h1>
);

export default PageTitle;
