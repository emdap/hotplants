import NavSidebarButton from "components/navigation/sidebar/NavSidebarButton";
import DarkModeToggle from "designSystem/DarkModeToggle";
import UserMenu from "./UserMenu";

const HeaderMenu = ({ openSidebar }: { openSidebar: () => void }) => (
  <header className="h-header w-full bg-fixed bg-top pretty-background flex items-center gap-4 px-safe-2 sticky top-0 z-10 border-b border-white/10">
    <NavSidebarButton openSidebar={openSidebar} />
    <div className="h-header py-2 max-lg:ml-auto max-lg:pl-8 flex gap-2 items-center">
      <img src="/favicon/apple-icon.png" className="h-full" />
      <span className="font-mono text-white/80">hotplants</span>
    </div>
    <div className="flex gap-4 items-center ml-auto">
      <DarkModeToggle />
      <UserMenu />
    </div>
  </header>
);

export default HeaderMenu;
