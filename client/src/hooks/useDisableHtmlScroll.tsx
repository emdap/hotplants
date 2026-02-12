import { useEffect } from "react";

export const useDisableHtmlScroll = (hideScroll?: boolean) => {
  const toggleHideScroll = (hide?: boolean) =>
    document.documentElement.classList.toggle(
      "small-screen:overflow-hidden!",
      Boolean(hide),
    );

  useEffect(() => {
    toggleHideScroll(hideScroll);
  }, [hideScroll]);

  useEffect(() => {
    return () => {
      toggleHideScroll(false);
    };
  }, []);

  return {
    toggleHideScroll,
  };
};
