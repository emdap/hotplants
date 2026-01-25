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
  { xBuffer = 1, yBuffer = 1 }: { xBuffer?: number; yBuffer?: number } = {},
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

export const BACKGROUND_ANIMATION_ID = "background-animation";

export const DEFAULT_DATE_FORMAT = "LLL d, yyyy";

// Needs to be kept in sync with tailwind-base-theme.css
export const isSmallScreen = () =>
  window.innerWidth < 1024 || window.innerHeight < 600;
