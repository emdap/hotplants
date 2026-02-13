import { Link, LinkProps, useLocation } from "@tanstack/react-router";
import classNames from "classnames";
import { useSidebarContext } from "contexts/sidebar/SidebarContext";
import Button from "designSystem/Button";
import Sidebar from "designSystem/sidebar/Sidebar";
import { IconType } from "react-icons/lib";
import { MdOutlineSearch, MdOutlineYoutubeSearchedFor } from "react-icons/md";
import { TbPlant2 } from "react-icons/tb";
import { isSmallScreen } from "util/generalUtil";

type SidebarNavItem = { icon: IconType; text: string } & LinkProps;

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    icon: MdOutlineSearch,
    text: "Plant Search",
    to: "/plant-search",
    search: { search: null },
  },
  {
    icon: MdOutlineYoutubeSearchedFor,
    text: "Search Archive",
    to: "/search-archive",
  },
  {
    icon: TbPlant2,
    text: "Gardens",
    to: "/gardens/{-$gardenName}",
    params: { gardenName: undefined },
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const { sidebarExpanded, setSidebarExpanded } = useSidebarContext();

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
          "[&_*]:text-white! border-r sticky top-header pb-3",
          "small-screen:bg-primary-dark small-screen:w-xs",
          "big-screen:h-dvh-header big-screen:border-r small-screen:border-none",
          {
            "big-screen:min-w-[300px] big-screen:w-[300px]": sidebarExpanded,
          },
        )
      }
    >
      {({ isExpanded, setIsExpanded }) => (
        <>
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
                  },
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
                      : "big-screen:opacity-0 big-screen:w-0",
                  )}
                >
                  {item.text}
                </span>
              </Button>
            </Link>
          ))}
        </>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
