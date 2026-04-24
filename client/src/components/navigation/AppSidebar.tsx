import { Link, LinkProps, useLocation } from "@tanstack/react-router";
import classNames from "classnames";
import { PLANTS_WITH_DATA_FILTER } from "components/entityForms/entityFilters/entityFilterUtil";
import { useAppContext } from "contexts/AppContext";
import BetaTag from "designSystem/BetaTag";
import Button from "designSystem/Button";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import Sidebar from "designSystem/Sidebar";
import { MenuItemData } from "designSystem/StyledMenu";
import { AnimatePresence, motion } from "motion/react";
import { CgReadme } from "react-icons/cg";
import { GiBearFace } from "react-icons/gi";
import { MdHistory, MdInfoOutline, MdOutlineSearch } from "react-icons/md";
import { TbPlant2 } from "react-icons/tb";
import { isSmallScreen } from "util/generalUtil";

type SidebarNavItem = PickRequired<
  MenuItemData,
  "Icon" | "label" | "linkProps"
> & { className?: string; isBeta?: boolean };

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    label: "Browse Plants",
    linkProps: {
      to: "/browse-plants",
      search: PLANTS_WITH_DATA_FILTER,
    },
    Icon: CgReadme,
  },
  {
    label: "New Search",
    linkProps: { to: "/new-search" },
    Icon: MdOutlineSearch,
  },
  {
    label: "Search History",
    linkProps: { to: "/search-history" },
    Icon: MdHistory,
  },
  {
    label: "Gardens",
    linkProps: { to: "/user-gardens" },
    Icon: TbPlant2,
  },
  {
    label: "Browse Animals",
    linkProps: {
      to: "/browse-animals",
    },
    Icon: GiBearFace,
    isBeta: true,
  },
  {
    label: "About",
    linkProps: { to: "/about" },
    Icon: MdInfoOutline,

    className: "mt-auto",
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const { sidebarExpanded, setSidebarExpanded } = useAppContext();

  const isActiveLink = (link: LinkProps) =>
    link.params
      ? [location.pathname, location.href].some((path) =>
          link.to?.includes(path),
        )
      : location.pathname === link.to;

  return (
    <Sidebar
      isExpanded={sidebarExpanded}
      setIsExpanded={setSidebarExpanded}
      className={(sidebarExpanded) =>
        classNames(
          "[&_*]:text-white border-r sticky top-header pb-3",
          "small-screen:bg-primary-dark small-screen:w-xs",
          "big-screen:h-dvh-header big-screen:border-r small-screen:border-none",
          {
            "big-screen:min-w-[300px] big-screen:w-[300px]": sidebarExpanded,
          },
        )
      }
    >
      {({ isExpanded, setIsExpanded }) => (
        <AnimatePresence>
          {SIDEBAR_ITEMS.map(({ Icon, className, ...item }, index) => (
            <Link
              key={index}
              {...item.linkProps}
              className={className}
              onClick={() => isSmallScreen() && setIsExpanded(false)}
            >
              <Button
                variant="icon-white"
                tabIndex={1}
                className={classNames(
                  "transition-all outline-none overflow-hidden focus:bg-white/20 h-12 justify-start w-[calc(100%-1rem)] big-screen:mx-0!",
                  {
                    "pl-6 big-screen:rounded-l-none": isExpanded,
                    "big-screen:p-2 big-screen:pl-2 big-screen:rounded-none  big-screen:w-full":
                      !isExpanded,
                    "bg-white/15 hover:bg-white/15 shadow-xs hover:shadow-xs":
                      isActiveLink(item.linkProps),
                  },
                )}
                icon={
                  <Icon
                    className={classNames(
                      "transition-[margin]",
                      item.isBeta && !isExpanded && "-mt-2",
                    )}
                    size={24}
                  />
                }
              >
                {item.isBeta && !isExpanded && (
                  <motion.div {...MOTION_FADE_IN}>
                    <BetaTag
                      key={`${index}-beta`}
                      className="-translate-x-full translate-y-full -ml-0.5"
                    />
                  </motion.div>
                )}
                <span
                  key="nav-item-text"
                  className={classNames(
                    "whitespace-nowrap transition-opacity flex items-center gap-2",
                    isExpanded
                      ? "big-screen:opacity-100"
                      : "big-screen:opacity-0 big-screen:w-0",
                  )}
                >
                  {item.label}
                  {item.isBeta && <BetaTag />}
                </span>
              </Button>
            </Link>
          ))}
        </AnimatePresence>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
