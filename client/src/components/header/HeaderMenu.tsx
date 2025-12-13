import { HEADER_HEIGHT } from "util/generalUtil";
import DarkModeToggle from "./DarkModeToggle";
import HeaderLinks from "./HeaderLinks";
import UserMenu from "./UserMenu";

const HeaderMenu = () => {
  return (
    <header
      className="w-full bg-fixed bg-top pretty-background flex items-center justify-between gap-4 px-2 sticky top-0 z-10 border-b border-white/5"
      style={{ height: HEADER_HEIGHT }}
    >
      <DarkModeToggle />
      <HeaderLinks />
      <UserMenu />
    </header>
  );
};

export default HeaderMenu;
