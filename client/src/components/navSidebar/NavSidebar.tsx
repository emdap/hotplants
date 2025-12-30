import { LinkProps } from "@tanstack/react-router";
import classNames from "classnames";
import Button from "designSystem/Button";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { useDisableHtmlScroll } from "hooks/useDisableHtmlScroll";
import { AnimatePresence } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import {
  MdOutlineFastRewind,
  MdOutlineSearch,
  MdOutlineSearchOff,
} from "react-icons/md";
import OverlayMask from "../../designSystem/OverlayMask";

type SidebarNavItem = { icon: ReactNode; text: string } & LinkProps;

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { icon: <MdOutlineSearch />, text: "New Search" },
  { icon: <MdOutlineSearchOff />, text: "Previous Searches" },
];

const NavSideBar = ({
  isExpanded: isExpandedProp,
  setIsExpanded: setIsExpandedProp,
}: {
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(Boolean(isExpandedProp));
  useCloseOnEscape(() => setIsExpanded(false), isExpanded);
  useDisableHtmlScroll(isExpanded);

  useEffect(() => {
    setIsExpanded(Boolean(isExpandedProp));
  }, [isExpandedProp]);

  useEffect(() => {
    setIsExpandedProp && setIsExpandedProp(isExpanded);
  }, [isExpanded, setIsExpandedProp]);

  return (
    <AnimatePresence>
      {isExpanded && (
        <OverlayMask
          key="mask"
          className="lg:hidden"
          animate={{ opacity: 0.9 }}
          onClick={() => setIsExpanded(false)}
        />
      )}
      <nav
        key="nav-sidebar"
        className={classNames(
          "text-white sticky top-header pt-8 flex flex-col transition-all duration-300",
          "max-lg:bg-accent bg-gradient-to-t from-default-background/30 lg:border-r border-white/10 ",
          "max-lg:fixed max-lg:z-50 h-dvh lg:h-dvh-header max-lg:top-0",
          {
            "max-lg:px-safe-2 w-3/5 min-w-fit lg:w-xs bg-default-background/20":
              isExpanded,
            "overflow-hidden max-lg:w-0 lg:w-8": !isExpanded,
          }
        )}
      >
        <Button
          variant="icon-white"
          className="transition-transform p-1! absolute top-0 right-0 outline-none"
          onClick={() => setIsExpanded(!isExpanded)}
          icon={
            <MdOutlineFastRewind
              className={classNames(!isExpanded && "lg:rotate-180")}
            />
          }
        />
        <div
          className={classNames("transition-all", isExpanded ? "px-6" : "px-0")}
        >
          {SIDEBAR_ITEMS.map((item, index) => (
            <Button
              variant="icon-white"
              className="m-0! text-xl! whitespace-nowrap"
              key={index}
              icon={item.icon}
            >
              {isExpanded && item.text}
            </Button>
          ))}
        </div>
      </nav>
    </AnimatePresence>
  );
};

export default NavSideBar;
