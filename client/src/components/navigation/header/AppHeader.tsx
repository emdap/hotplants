import { useSidebarContext } from "contexts/sidebar/SidebarContext";
import Button from "designSystem/Button";
import DarkModeToggle from "designSystem/darkMode/DarkModeToggle";
import { MdOutlineMenu } from "react-icons/md";
import UserMenu from "./UserMenu";

const AppHeader = () => {
  const { setSidebarExpanded } = useSidebarContext();

  return (
    <header className="h-header min-h-header w-full bg-header small-screen:grid-centered flex items-center gap-4 page-buffer sticky top-0 left-0 z-30 border-header text-white">
      <Button
        variant="text-primary"
        onClick={() => setSidebarExpanded(true)}
        className="big-screen:hidden w-min p-0! text-white/60 hover:text-white/80"
        icon={<MdOutlineMenu size={24} />}
      />

      <div className="h-header py-2 flex gap-2 items-center">
        <img src="/favicon/apple-icon.png" className="h-full" />
        <h6 className="font-mono text-white/80!">hotplants</h6>
      </div>

      <div className="flex gap-4 items-center ml-auto h-full">
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
