import { MotionProps } from "motion/react";

export const MOTION_FADE_IN: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const CUSTOM_MOTION_FADE_IN = (extraProps: MotionProps) => {
  const newProps: MotionProps = extraProps;

  Object.entries(MOTION_FADE_IN).forEach(([key, value]) => {
    const typesafeKey = key as keyof MotionProps;

    if (
      typeof value === "object" &&
      (!extraProps[typesafeKey] || typeof extraProps[typesafeKey] === "object")
    ) {
      newProps[typesafeKey] = { ...value, ...extraProps[typesafeKey] };
    }
  });

  return newProps;
};
