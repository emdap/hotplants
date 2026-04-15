import { CombinedGraphQLErrors } from "@apollo/client";
import { EntityResult } from "contexts/entitySelection/EntitySelectionContext";
import { GraphQLFormattedError } from "graphql";
import { capitalize } from "lodash";
import { HTMLMotionProps } from "motion/react";
import { HTMLProps } from "react";
import { ExternalToast, toast } from "sonner";
import { defaultErrorToast } from "./toastUtil";

export type CommonMotionDivProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children">;

export const ITERATE_DIRECTION = ["prev", "next"] as const;
export type IterateDirection = (typeof ITERATE_DIRECTION)[number];

export const getEntityDisplayNames = (entity: EntityResult) => {
  const commonName = entity.commonNames?.[0];
  return {
    title: commonName ? capitalize(commonName) : entity.scientificName,
    subTitle: commonName ? entity.scientificName : undefined,
  };
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

export const handleGraphQlError = (
  error: unknown,
  {
    customErrorHandler,
    ...toastProps
  }: {
    customErrorHandler?: (error: GraphQLFormattedError) => void;
  } & ExternalToast = {},
) => {
  if (error instanceof CombinedGraphQLErrors) {
    error.errors.map((error) => {
      if (error.message) {
        customErrorHandler
          ? customErrorHandler(error)
          : toast.error(error.message, toastProps);
      } else {
        defaultErrorToast(toastProps);
      }
    });
  } else {
    defaultErrorToast(toastProps);
  }
};

export const VOID_FUNCTION = () => {};
export const VOID_PROMISE_FUNCTION = async () => {};

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
