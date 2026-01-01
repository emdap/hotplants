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
          className="lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <nav
        key="nav-sidebar"
        {...swipeHandlers}
        className={classNames(
          "[&_*]:text-white! sticky top-header flex flex-col max-lg:gap-2 transition-all duration-300 pb-8",
          "max-lg:bg-primary-dark bg-gradient-to-t from-default-background/30 to-90% lg:border-r border-white/10 ",
          "max-lg:fixed max-lg:z-50 h-dvh lg:h-dvh-header max-lg:top-0 overflow-auto",
          {
            "max-lg:px-safe-2 max-lg:w-xs lg:min-w-[300px] lg:w-[300px] lg:bg-primary-dark/40":
              isExpanded,
            "max-lg:w-0 lg:w-header": !isExpanded,
          }
        )}
      >
        <div className="sticky top-0 place-self-end max-lg:bg-inherit py-1 px-1.5">
          <Button
            variant="text"
            className={classNames(
              "transition-all outline-none p-1! mb-2 rounded-full! hover:border-white/40 border border-transparent aspect-square"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            icon={
              <MdKeyboardDoubleArrowLeft
                className={classNames(!isExpanded && "lg:rotate-180")}
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
                "transition-all! outline-none overflow-hidden focus:bg-white/20 h-12! justify-start lg:[&_.icon-wrapper]:m-0!",
                {
                  "lg:ml-0! lg:pl-6! lg:rounded-l-none w-[calc(100%-1rem)]":
                    isExpanded,
                  "lg:p-2! lg:pl-2! lg:rounded-none lg:mx-0! w-full":
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
                  isExpanded ? "lg:opacity-100" : "lg:opacity-0 w-0"
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
