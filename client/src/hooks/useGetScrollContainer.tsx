import { useLayoutEffect, useState } from "react";
import { isSmallScreen } from "util/generalUtil";

export const useGetScrollContainer = () => {
  const [scrollElements, setElements] = useState<{
    scrollContainer: Document | HTMLElement | null;
    scrollContainerElement: HTMLElement | null;
  }>({ scrollContainer: null, scrollContainerElement: null });

  const setScrollContainer = () => {
    if (isSmallScreen()) {
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
