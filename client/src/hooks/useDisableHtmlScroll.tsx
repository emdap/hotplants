import { useEffect } from "react";

export const useDisableHtmlScroll = (hideScroll?: boolean) => {
  const toggleHideScroll = (hide?: boolean) =>
    document.documentElement.classList.toggle(
      "max-md:overflow-hidden!",
      Boolean(hide)
    );

  useEffect(() => {
    toggleHideScroll(hideScroll);
  }, [hideScroll]);

  return {
    toggleHideScroll,
  };
};
