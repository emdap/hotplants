import classNames from "classnames";
import { HTMLProps, useLayoutEffect, useRef } from "react";
import { BACKGROUND_ANIMATION_ID, findAnimation } from "util/generalUtil";

const FloatingHeader = ({
  className,
  ...props
}: HTMLProps<HTMLHeadingElement>) => {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const syncAnimation = () => {
      const headerAnimation = findAnimation(
        headerRef.current,
        "background-shift",
      );

      if (headerAnimation) {
        const backgroundAnimation = findAnimation(
          document.getElementById(BACKGROUND_ANIMATION_ID),
          "background-shift",
        );

        if (backgroundAnimation) {
          headerAnimation.currentTime = backgroundAnimation.currentTime;
        }
      }
    };

    syncAnimation();

    window.addEventListener("resize", syncAnimation);
    return () => window.removeEventListener("resize", syncAnimation);
  }, []);

  return (
    <header
      ref={headerRef}
      className={classNames(
        "floating-header sticky top-header z-20",
        "grid-centered items-center justify-between gap-4",
        "big-screen:text-white big-screen:h-header big-screen:border-header big-screen:bg-header big-screen:py-1",
        "small-screen:card small-screen:card-solid small-screen:py-1 small-screen:px-2",
        className,
      )}
      {...props}
    />
  );
};

export default FloatingHeader;
