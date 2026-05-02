import { useRouterState } from "@tanstack/react-router";
import { HTMLProps, useEffectEvent, useLayoutEffect, useRef } from "react";
import { useGetScrollContainer } from "../hooks/useGetScrollContainer";

export const ScrollAnchor = ({
  enabled = true,
  ...props
}: { enabled?: boolean } & Omit<HTMLProps<HTMLElement>, "ref">) => {
  const { scrollContainerElement } = useGetScrollContainer();
  const anchorRef = useRef<HTMLDivElement>(null);

  const location = useRouterState({
    select: (s) => s.location,
  });

  const scrollToAnchor = useEffectEvent(() => {
    if (
      scrollContainerElement &&
      anchorRef.current &&
      scrollContainerElement.scrollTop > anchorRef.current.offsetTop
    ) {
      scrollContainerElement.scrollTo({
        top: anchorRef.current.offsetTop,
        behavior: "instant",
      });
      anchorRef.current.scrollIntoView({ behavior: "instant" });
    }
  });

  useLayoutEffect(() => {
    enabled && scrollToAnchor();
  }, [location, enabled]);

  return <div ref={anchorRef} {...props} />;
};
