import { useLayoutEffect, useState } from "react";

export const MEDIUM_SCREEN_SIZE = 768;

export const useGetScrollContainer = () => {
  const [scrollElements, setElements] = useState<{
    scrollContainer: Document | HTMLElement | null;
    scrollContainerElement: HTMLElement | null;
  }>({ scrollContainer: null, scrollContainerElement: null });

  const setScrollContainer = () => {
    if (window.innerWidth < MEDIUM_SCREEN_SIZE) {
      setElements({
        scrollContainer: document,
        scrollContainerElement: document.documentElement,
      });
    } else {
      const body = document.querySelector("body");
      setElements({
        scrollContainer: body,
        scrollContainerElement: body,
      });
    }
  };

  useLayoutEffect(() => {
    setScrollContainer();
    window.addEventListener("resize", setScrollContainer);

    return () => window.removeEventListener("resize", setScrollContainer);
  }, []);

  return scrollElements;
};
