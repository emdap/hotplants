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

export const DEFAULT_DATE_TIME_FORMAT = "LLL d, yyyy 'at' HH:mm";

export const BACKGROUND_ANIMATION_ID = "background-animation";
export const findAnimation = (
  element: Document | Element | null,
  animationName: string,
) =>
  element
    ?.getAnimations()
    .find(
      (animation) =>
        animation instanceof CSSAnimation &&
        animation.effect instanceof KeyframeEffect &&
        animation.animationName === animationName,
    );

export const getLastPage = (pageSize: number, resultsCount?: number) =>
  resultsCount && pageSize ? Math.ceil(resultsCount / pageSize) : 0;

export const isLeafletEvent = (event?: Pick<Event, "target">) =>
  event?.target && "_leaflet_id" in event.target;

// Seeing issues with scroll functionalities in Safari
export const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent,
);

// Needs to be kept in sync with tailwind-base-theme.css
export const SMALL_SCREEN_WIDTH = 1024;
export const SMALL_SCREEN_HEIGHT = 600;

export const isSmallScreen = () =>
  window.innerWidth < SMALL_SCREEN_WIDTH ||
  window.innerHeight < SMALL_SCREEN_HEIGHT;
