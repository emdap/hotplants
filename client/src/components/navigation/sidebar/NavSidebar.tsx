import { Link, LinkProps, useLocation } from "@tanstack/react-router";
import classNames from "classnames";
import Button from "designSystem/Button";
import { useCloseOnEscape } from "hooks/useCloseOnEscape";
import { useDisableHtmlScroll } from "hooks/useDisableHtmlScroll";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { IconType } from "react-icons/lib";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineSearch,
  MdOutlineYoutubeSearchedFor,
} from "react-icons/md";
import { TbPlant2 } from "react-icons/tb";
import { useSwipeable } from "react-swipeable";
import { isSmallScreen } from "util/generalUtil";
import OverlayMask from "../../../designSystem/OverlayMask";

type SidebarNavItem = { icon: IconType; text: string } & LinkProps;

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    icon: MdOutlineSearch,
    text: "New Search",
    to: "/search",
  },
  {
    icon: MdOutlineYoutubeSearchedFor,
    text: "Previous Searches",
    to: "/search/browse",
  },
  {
    icon: TbPlant2,
    text: "Gardens",
    to: "/gardens/{-$gardenName}",
    params: { gardenName: undefined },
  },
];

const NavSideBar = ({
  isExpanded: isExpandedProp,
  setIsExpanded: setIsExpandedProp,
}: {
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
}) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(Boolean(isExpandedProp));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsExpanded(false),
  });
  useCloseOnEscape(() => setIsExpanded(false), isExpanded);
  useDisableHtmlScroll(isExpanded);

  useEffect(() => {
    setIsExpanded(Boolean(isExpandedProp));
  }, [isExpandedProp]);

  useEffect(() => {
    setIsExpandedProp && setIsExpandedProp(isExpanded);
  }, [isExpanded, setIsExpandedProp]);

  const isActiveLink = (link: LinkProps) =>
    link.params
      ? [location.pathname, location.href].some((path) =>
          link.to?.includes(path)
        )
      : location.pathname === link.to;

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
        key="nav-sidebar"
        {...swipeHandlers}
        className={classNames(
          "[&_*]:text-white! sticky top-header flex flex-col  transition-all duration-300 pb-8 overflow-auto",
          "small-screen:gap-2 small-screen:fixed small-screen:z-50 small-screen:top-0 small-screen:h-dvh small-screen:bg-primary-dark",
          "small-screen:px-safe-2 small-screen:pr-0! small-screen:w-xs",
          "big-screen:h-dvh-header big-screen:border-r border-white/10",
          "bg-gradient-to-t from-default-background/30 to-90%",
          {
            "big-screen:min-w-[300px] big-screen:w-[300px] small-screen:translate-x-0":
              isExpanded,
            "big-screen:w-header small-screen:-translate-x-full": !isExpanded,
          }
        )}
      >
        <div className="sticky top-0 place-self-end small-screen:bg-inherit py-1 px-1.5">
          <Button
            variant="text"
            className={classNames(
              "transition-all outline-none p-1! mb-2 rounded-full! hover:border-white/40 border border-transparent aspect-square"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            icon={
              <MdKeyboardDoubleArrowLeft
                className={classNames(!isExpanded && "big-screen:rotate-180")}
              />
            }
          />
        </div>

        {SIDEBAR_ITEMS.map(({ icon, ...item }, index) => (
          <Link
            key={index}
            {...item}
            onClick={() => isSmallScreen() && setIsExpanded(false)}
          >
            <Button
              variant="icon-white"
              className={classNames(
                "transition-all! outline-none overflow-hidden focus:bg-white/20 h-12! justify-start big-screen:[&_.icon-wrapper]:m-0! w-[calc(100%-1rem)]",
                {
                  "big-screen:ml-0! big-screen:pl-6! big-screen:rounded-l-none":
                    isExpanded,
                  "big-screen:p-2! big-screen:pl-2! big-screen:rounded-none big-screen:mx-0! big-screen:w-full":
                    !isExpanded,
                  "bg-white/10": isActiveLink(item),
                }
              )}
              icon={icon({
                size: 24,
              })}
            >
              <span
                key="nav-item-text"
                className={classNames(
                  "whitespace-nowrap transition-opacity",
                  isExpanded
                    ? "big-screen:opacity-100"
                    : "big-screen:opacity-0 big-screen:w-0"
                )}
              >
                {item.text}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </AnimatePresence>
  );
};

export default NavSideBar;
