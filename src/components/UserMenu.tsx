import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuthSession } from "util/authClient";

const UserMenu = () => {
  const { data: authData } = useAuthSession();

  return authData ? (
    <Menu>
      <MenuButton>My account</MenuButton>
      <MenuItems anchor="bottom">
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/settings">
            Settings
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/support">
            Support
          </a>
        </MenuItem>
        <MenuItem>
          <a className="block data-focus:bg-blue-100" href="/license">
            License
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>
  ) : null;
};

export default UserMenu;
