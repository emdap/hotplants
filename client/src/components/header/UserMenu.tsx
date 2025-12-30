import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { useAuthSession } from "config/authClient";
import { useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { MdLogin, MdLogout } from "react-icons/md";
import { FileRoutesByTo } from "routeTree.gen";

type MenuItemContent = {
  key: string;
  displayText: string;
  Icon: IconType;
  path?: keyof FileRoutesByTo;
};

const USER_LINKS: MenuItemContent[] = [
  { key: "logout", displayText: "Log Out", path: "/logout", Icon: MdLogout },
];
const ANON_LINKS: MenuItemContent[] = [
  { key: "login", displayText: "Log In", path: "/login", Icon: MdLogin },
];

const UserMenu = () => {
  const { data: authData } = useAuthSession();

  const menuItemContent = ({ displayText, Icon }: MenuItemContent) => (
    <div className="cursor-pointer flex gap-2 items-center hover:bg-primary/40 p-2 rounded-md font-medium">
      <Icon size={16} />
      {displayText}
    </div>
  );

  const menuLinks = useMemo(
    () => (authData ? USER_LINKS : ANON_LINKS),
    [authData]
  );

  return (
    <Menu>
      <MenuButton className="cursor-pointer text-white/60 hover:text-white/80 data-open:text-white/80 transition-colors focus-ring outline-white/80 rounded-sm">
        <FaUserCircle size={20} />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="z-30 shadow-lg w-52 origin-top-right rounded-md border border-accent/20 bg-default-background p-1 text-sm transition mt-1 focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        {authData && (
          <p className="p-2 ">
            Signed in as <strong>{authData?.user.name}</strong>
          </p>
        )}
        {menuLinks.map((item) => (
          <MenuItem key={item.key}>
            {item.path ? (
              <Link to={item.path}>{menuItemContent(item)}</Link>
            ) : (
              menuItemContent(item)
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default UserMenu;
