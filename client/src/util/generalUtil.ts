import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";
import { HTMLMotionProps } from "motion/react";
import { HTMLProps } from "react";

export type CommonMotionDivProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children">;

export const ITERATE_DIRECTION = ["prev", "next"] as const;
export type IterateDirection = (typeof ITERATE_DIRECTION)[number];

export const elementInViewport = (
  element: HTMLElement,
  { xBuffer = 1, yBuffer = 1 }: { xBuffer?: number; yBuffer?: number } = {}
) => {
  const rect = element.getBoundingClientRect();

  const buffedWidth = rect.width * xBuffer;
  const buffedHeight = rect.height * yBuffer;

  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.left + buffedWidth >= 0 &&
    rect.right - buffedWidth <= windowWidth &&
    rect.top + buffedHeight + 1000 >= 0 &&
    rect.bottom - buffedHeight - 1000 <= windowHeight
  );
};

export const getPlantDisplayName = (plant: PlantResult) => {
  const commonName = plant.commonNames?.[0];
  return commonName ? capitalize(commonName) : plant.scientificName;
};

export const MEDIUM_SCREEN_SIZE = 768;
const TALL_SCREEN_SIZE = 600;
export const isSmallScreen = () =>
  window.innerWidth < MEDIUM_SCREEN_SIZE ||
  window.innerHeight < TALL_SCREEN_SIZE;
