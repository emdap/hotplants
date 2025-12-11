import { motion } from "motion/react";
import { ReactNode } from "react";
import { MOTION_FADE_IN } from "./motionTransitions";

const PageTitle = ({ children }: { children: ReactNode }) => (
  <motion.h1 className="px-4 py-6 dark:text-white/80" {...MOTION_FADE_IN}>
    {children}
  </motion.h1>
);

export default PageTitle;
