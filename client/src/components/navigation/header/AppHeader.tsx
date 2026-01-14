import DarkModeToggle from "designSystem/DarkModeToggle";
import OpenSidebarButton, {
  OpenSidebarButtonProps,
} from "designSystem/sidebar/OpenSidebarButton";
import { MdOutlineMenu } from "react-icons/md";
import UserMenu from "./UserMenu";

const AppHeader = ({
  openSidebar,
}: Pick<OpenSidebarButtonProps, "openSidebar">) => (
  <header className="h-header min-h-header w-full bg-header small-screen:grid-centered flex items-center gap-4 px-safe-2 sticky top-0 left-0 z-30 border-header text-white">
    <OpenSidebarButton
      className="big-screen:hidden mr-auto text-white/60 hover:text-white/80"
      icon={<MdOutlineMenu size={24} />}
      openSidebar={openSidebar}
    />

    <div className="h-header py-2 flex gap-2 items-center">
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
