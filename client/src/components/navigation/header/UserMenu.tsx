import { useAuthSession } from "config/authConfig";
import { useAppContext } from "contexts/AppContext";
import Button from "designSystem/Button";
import StyledMenu, { MenuItemData } from "designSystem/StyledMenu";
import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdLogin, MdLogout } from "react-icons/md";

const USER_LINKS: MenuItemData[] = [
  { label: "Log Out", linkProps: { to: "/logout" }, Icon: MdLogout },
];
const ANON_LINKS: MenuItemData[] = [
  { label: "Log In", linkProps: { to: "/login" }, Icon: MdLogin },
];

const UserMenu = () => {
  const { serverReady } = useAppContext();
  const { data: authData, refetch } = useAuthSession();

  useEffect(() => {
    serverReady && refetch();
  }, [serverReady, refetch]);

  return (
    <StyledMenu
      anchor="bottom end"
      menuButton={
        <Button
          variant="text"
          size="flush"
          icon={<FaUserCircle size={20} />}
          className="text-white/60 hover:text-white/80 data-open:text-white/80 transition-colors"
        />
      }
      items={authData ? USER_LINKS : ANON_LINKS}
      itemsAsCard
    >
      {authData && (
        <p className="p-2 ">
          Signed in as <strong>{authData?.user.name}</strong>
        </p>
      )}
    </StyledMenu>
  );
};

export default UserMenu;
