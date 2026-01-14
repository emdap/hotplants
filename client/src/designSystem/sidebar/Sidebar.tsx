import classNames from "classnames";
import Button from "designSystem/Button";
import OverlayMask from "designSystem/OverlayMask";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { AnimatePresence } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { useSwipeable } from "react-swipeable";

export type SidebarProps = {
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
};

type SidebarChild = (props: Required<SidebarProps>) => ReactNode;

type SidebarReactiveProps = {
  className?: string | ((isExpanded: boolean) => string);
  children: ReactNode | SidebarChild;
};

const Sidebar = ({
  isExpanded: isExpandedProp,
  setIsExpanded: setIsExpandedProp,
  className,
  children,
}: SidebarProps & SidebarReactiveProps) => {
  const [isExpanded, setIsExpanded] = useState(Boolean(isExpandedProp));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsExpanded(false),
  });
  useCloseOnEscape(() => setIsExpanded(false), isExpanded);

  useEffect(() => {
    setIsExpanded(Boolean(isExpandedProp));
  }, [isExpandedProp]);

  useEffect(() => {
    setIsExpandedProp && setIsExpandedProp(isExpanded);
  }, [isExpanded, setIsExpandedProp]);

  const childrenProps = { isExpanded, setIsExpanded };

  return (
    <AnimatePresence>
      <OverlayMask
        show={isExpanded}
        key="mask"
        className="big-screen:hidden bg-accent/10!"
        onClick={() => setIsExpanded(false)}
      />

      <nav
        key="sidebar"
        {...swipeHandlers}
        className={classNames(
          "border-header bg-gradient-to-t from-default-background/30 to-90%",
          "flex flex-col transition-all duration-300",
          "small-screen:gap-2 small-screen:fixed small-screen:z-50 small-screen:top-0 small-screen:h-dvh",
          {
            "small-screen:translate-x-0": isExpanded,
            "small-screen:-translate-x-full big-screen:w-header big-screen:min-w-header":
              !isExpanded,
          },
          typeof className === "function" ? className(isExpanded) : className
        )}
      >
        <div className="sticky top-0 place-self-end small-screen:bg-inherit py-1 px-1.5">
          <Button
            variant="text"
            className={classNames(
              "text-white transition-all outline-none p-1! mb-2 rounded-full! hover:border-white/40 border border-transparent aspect-square"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            icon={
              <MdKeyboardDoubleArrowLeft
                className={classNames(!isExpanded && "big-screen:rotate-180")}
              />
            }
          />
        </div>

        {typeof children === "function" ? children(childrenProps) : children}
      </nav>
    </AnimatePresence>
  );
};

export default Sidebar;
