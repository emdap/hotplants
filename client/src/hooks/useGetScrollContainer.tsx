import { useLayoutEffect, useState } from "react";
import { isSmallScreen } from "util/generalUtil";

export const useGetScrollContainer = () => {
  const getElements = () => {
    if (isSmallScreen()) {
      return {
        scrollContainer: document,
        scrollContainerElement: document.documentElement,
      };
    } else {
      const body = document.querySelector("body");
      return {
        scrollContainer: body,
        scrollContainerElement: body,
      };
    }
  };

  const [scrollElements, setScrollElements] = useState(() => getElements());

  useLayoutEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    const setScrollContainer = () => setScrollElements(getElements());

    setScrollContainer();
    window.addEventListener("resize", setScrollContainer);

    return () => window.removeEventListener("resize", setScrollContainer);
  }, []);

  return scrollElements;
};
