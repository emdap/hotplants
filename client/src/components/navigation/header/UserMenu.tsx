import { useAuthSession } from "config/authClient";
import Button from "designSystem/Button";
import StyledMenu, { MenuItemData } from "designSystem/StyledMenu";
import { FaUserCircle } from "react-icons/fa";
import { MdLogin, MdLogout } from "react-icons/md";

const USER_LINKS: MenuItemData[] = [
  { label: "Log Out", linkTo: "/logout", Icon: MdLogout },
];
const ANON_LINKS: MenuItemData[] = [
  { label: "Log In", linkTo: "/login", Icon: MdLogin },
];

const UserMenu = () => {
  const { data: authData } = useAuthSession();

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
