import { useEffect } from "react";

export const useDisableHtmlScroll = (toggleDisabled?: boolean) => {
  const hideHtmlScrollbar = () =>
    document.documentElement.classList.add("overflow-hidden!");

  const showHtmlScrollbar = () =>
    document.documentElement.classList.remove("overflow-hidden!");

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
