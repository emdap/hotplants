import { Link, LinkProps, useLocation } from "@tanstack/react-router";
import classNames from "classnames";

const HEADER_LINKS: ({ displayText: string } & LinkProps)[] = [
  {
    displayText: "search",
    to: "/search",
  },
  {
    displayText: "gardens",
    to: "/gardens/{-$gardenName}",
    params: { gardenName: undefined },
  },
];

const HeaderLinks = () => {
  const location = useLocation();

  const isActiveLink = (linkTo?: string) =>
    [location.pathname, location.href].some((path) => linkTo?.includes(path));

  return (
    <div className="flex items-center gap-8 text-white text-sm h-full">
      {HEADER_LINKS.map(({ displayText, ...linkProps }, index) => (
        <Link
          {...linkProps}
          key={index}
          className={classNames({
            "font-semibold": isActiveLink(linkProps.to),
          })}
        >
          {displayText}
        </Link>
      ))}
    </div>
  );
};

export default HeaderLinks;
