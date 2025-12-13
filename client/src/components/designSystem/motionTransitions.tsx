import { MotionProps } from "motion/react";

export const MOTION_SLIDE_LEFT: MotionProps = {
  initial: { marginLeft: "100%" },
  animate: { marginLeft: 0 },
  exit: { marginLeft: "-100%" },
};

export const MOTION_SLIDE_UP: MotionProps = {
  initial: { marginTop: 10 },
  animate: { marginTop: 0 },
  exit: { marginTop: -10 },
};

export const MOTION_FADE_IN: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const mergeMotionProps = (
  baseProps: MotionProps,
  addProps: MotionProps
) => {
  const newProps: MotionProps = { ...addProps };

  Object.entries(baseProps).forEach(([key, value]) => {
    const typesafeKey = key as keyof MotionProps;

    if (
      typeof value === "object" &&
      (!addProps[typesafeKey] || typeof addProps[typesafeKey] === "object")
    ) {
      newProps[typesafeKey] = { ...value, ...addProps[typesafeKey] };
    }
  });

  return newProps;
};

export const MOTION_FADE_SLIDE = mergeMotionProps(
  MOTION_FADE_IN,
  MOTION_SLIDE_UP
);
