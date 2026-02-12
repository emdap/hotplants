import { useRouterState } from "@tanstack/react-router";
import { HTMLProps, useLayoutEffect, useRef } from "react";
import { useGetScrollContainer } from "./useGetScrollContainer";

export const useScrollAnchor = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { scrollContainerElement } = useGetScrollContainer();
  const anchorRef = useRef<HTMLDivElement>(null);

  const location = useRouterState({
    select: (s) => s.location,
  });

  useLayoutEffect(() => {
    if (!enabled || !scrollContainerElement || !anchorRef.current) {
      return;
    }

    if (scrollContainerElement.scrollTop > anchorRef.current.offsetTop) {
      scrollContainerElement.scrollTo({
        top: anchorRef.current.offsetTop,
        behavior: "instant",
      });
      anchorRef.current.scrollIntoView({ behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, enabled]);

  return (props: Omit<HTMLProps<HTMLElement>, "ref">) => (
    <div ref={anchorRef} {...props} />
  );
};
