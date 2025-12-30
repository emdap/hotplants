import { ReactNode } from "react";
import DarkModeToggle from "../../designSystem/DarkModeToggle";
import HeaderLinks from "./HeaderLinks";
import UserMenu from "./UserMenu";

const HeaderMenu = ({ children }: { children?: ReactNode }) => {
  return (
    <header className="h-header w-full bg-fixed bg-top pretty-background flex items-center justify-between gap-4 px-safe-2 sticky top-0 z-10 border-b border-white/10">
      {children}
      <HeaderLinks />
      <div className="flex gap-4 items-center">
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default HeaderMenu;
