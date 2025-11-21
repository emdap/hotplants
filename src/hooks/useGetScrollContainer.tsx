import { useLayoutEffect, useState } from "react";
import { useDocumentListener } from "./useDocumentListener";

export const MEDIUM_SCREEN_SIZE = 768;

// TODO: Duplicate code around assigning scroll listener, any way to simplify this? Always use html/doc as scroller?
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
  }, []);

  useDocumentListener("resize", setScrollContainer);

  return scrollElements;
};
