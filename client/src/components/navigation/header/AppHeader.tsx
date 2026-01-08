import NavSidebarButton from "components/navigation/sidebar/NavSidebarButton";
import DarkModeToggle from "designSystem/DarkModeToggle";
import UserMenu from "./UserMenu";

const AppHeader = ({ openSidebar }: { openSidebar: () => void }) => (
  <header className="h-header w-full bg-header flex items-center gap-4 px-safe-2 sticky top-0 z-30 border-header">
    <NavSidebarButton openSidebar={openSidebar} />
    <div className="h-header py-2 small-screen:ml-auto small-screen:pl-8 flex gap-2 items-center">
      <img src="/favicon/apple-icon.png" className="h-full" />
      <h6 className="font-mono text-white/80!">hotplants</h6>
    </div>
    <div className="flex gap-4 items-center ml-auto">
      <DarkModeToggle />
      <UserMenu />
    </div>
  </header>
);

export default AppHeader;
