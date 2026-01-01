import { useEffect } from "react";

export const useDisableHtmlScroll = (toggleDisabled?: boolean) => {
  const hideHtmlScrollbar = () =>
    document.documentElement.classList.add("max-md:overflow-hidden!");

  const showHtmlScrollbar = () =>
    document.documentElement.classList.remove("max-md:overflow-hidden!");

  useEffect(() => {
    if (toggleDisabled === true) {
      hideHtmlScrollbar();
    } else if (toggleDisabled === false) {
      showHtmlScrollbar();
    }
  }, [toggleDisabled]);

  return {
    hideHtmlScrollbar,
    showHtmlScrollbar,
  };
};
