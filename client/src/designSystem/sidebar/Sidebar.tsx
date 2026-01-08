import classNames from "classnames";
import Button from "designSystem/Button";
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
  overlay?: SidebarChild;
};

const Sidebar = ({
  isExpanded: isExpandedProp,
  setIsExpanded: setIsExpandedProp,
  className,
  children,
  overlay,
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
      {overlay && overlay(childrenProps)}
      <nav
        key="sidebar"
        {...swipeHandlers}
        className={classNames(
          "border-header bg-gradient-to-t from-default-background/30 to-90%",
          "flex flex-col transition-all duration-300",
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
