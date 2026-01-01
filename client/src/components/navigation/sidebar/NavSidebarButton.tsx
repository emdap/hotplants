import Button from "designSystem/Button";
import { MdOutlineMenu } from "react-icons/md";

const NavSidebarButton = ({ openSidebar }: { openSidebar: () => void }) => (
  <Button
    variant="text"
    className="text-white/60 hover:text-white/80 big-screen:hidden p-0!"
    onClick={openSidebar}
    icon={<MdOutlineMenu size={24} />}
  />
);

export default NavSidebarButton;
