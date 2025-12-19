import { Link, useLocation } from "@tanstack/react-router";
import classNames from "classnames";
import { FileRoutesByTo } from "routeTree.gen";

const HEADER_LINKS: { displayText: string; path: keyof FileRoutesByTo }[] = [
  {
    displayText: "search",
    path: "/search",
  },
  { displayText: "gardens", path: "/gardens" },
];

const HeaderLinks = () => {
  const location = useLocation();

  return (
    <div className="flex items-center gap-8 text-white text-sm h-full">
      {HEADER_LINKS.map(({ displayText, path }, index) => (
        <Link
          to={path}
          key={index}
          className={classNames(location.pathname === path && "font-semibold")}
        >
          {displayText}
        </Link>
      ))}
    </div>
  );
};

export default HeaderLinks;
