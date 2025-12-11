import { ReactNode } from "react";
import { Link } from "react-router";
import { useAuthSession } from "util/authClient";

const HeaderMenu = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const { data: authData } = useAuthSession();

  return (
    <div className="h-6 w-full bg-fixed bg-top backdrop-blur-3xl pretty-background flex items-center justify-between gap-4 p-2 sticky top-0 z-10">
      {children}

      {authData && (
        <Link to="/logout">
          <span className="text-bold text-xs text-white">
            {authData.user.name}
          </span>
        </Link>
      )}
    </div>
  );
};

export default HeaderMenu;
