import classNames from "classnames";
import Button from "designSystem/Button";
import OverlayMask from "designSystem/OverlayMask";
import { useEscapeKeyListener } from "hooks/useEscapeKeyListener";
import { AnimatePresence } from "motion/react";
import { HTMLAttributes, ReactNode, RefObject } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import { isLeafletEvent } from "util/generalUtil";

type SidebarProps = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;

  externalCollapseButton?: boolean;
  ref?: RefObject<HTMLElement | null>;
  style?: HTMLAttributes<HTMLElement>["style"];
};

type SidebarChild = (
  props: Required<
    Omit<SidebarProps, "externalCollapseButton" | "ref" | "style">
  >,
) => ReactNode;

type SidebarReactiveProps = {
  className?: string | ((isExpanded: boolean) => string);
  children: ReactNode | SidebarChild;
};

const Sidebar = ({
  isExpanded,
  setIsExpanded,
  externalCollapseButton,
  className,
  children,
  ref,
  style,
}: SidebarProps & SidebarReactiveProps) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: ({ event }) => !isLeafletEvent(event) && setIsExpanded(false),
  });

  useEscapeKeyListener((e) => {
    e.stopImmediatePropagation();
    setIsExpanded(false);
  }, isExpanded);

  const refPassthrough = (el: HTMLElement) => {
    swipeHandlers.ref(el);
    if (ref) {
      ref.current = el;
    }
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <OverlayMask
          key="mask"
          className="big-screen:hidden bg-accent/10!"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <nav
        key="sidebar"
        {...swipeHandlers}
        ref={refPassthrough}
        className={classNames(
          "border-header bg-gradient-to-t from-default-background/30 to-90%",
          "flex flex-col transition-all duration-300 z-40 small-screen:z-50",
          "small-screen:gap-2 small-screen:fixed small-screen:top-0 small-screen:h-dvh small-screen:pl-safe-4 small-screen:pr-4",
          {
            "small-screen:translate-x-0": isExpanded,
            "small-screen:-translate-x-full big-screen:w-header big-screen:min-w-header":
              !isExpanded,
            "small-screen:overflow-auto": externalCollapseButton,
            "big-screen:mr-4": externalCollapseButton && isExpanded,
            "overflow-auto": !externalCollapseButton,
          },
          typeof className === "function" ? className(isExpanded) : className,
        )}
        style={style}
      >
        <Button
          variant="text-primary"
          className={classNames(
            "sidebar-button place-self-end top-1 z-50",
            "text-white transition-all outline-none p-1! mb-2 rounded-full! hover:border-white/40 border border-transparent",
            {
              "bg-inherit": isExpanded,
              "sticky big-screen:right-1.5 small-screen:-mr-2":
                !externalCollapseButton,
            },
            externalCollapseButton && [
              "big-screen:absolute small-screen:sticky",
              {
                "big-screen:right-1.5": !isExpanded,
                "big-screen:absolute big-screen:translate-x-1/2 small-screen:-mr-2":
                  isExpanded,
              },
            ],
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          icon={
            <MdKeyboardDoubleArrowLeft
              className={classNames(!isExpanded && "big-screen:rotate-180")}
            />
          }
        />

        {typeof children === "function"
          ? children({ isExpanded, setIsExpanded })
          : children}
      </nav>
    </AnimatePresence>
  );
};

export default Sidebar;
