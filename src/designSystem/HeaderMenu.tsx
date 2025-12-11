import { authClient } from "auth/auth-client";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";

const HeaderMenu = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [userName, setUserName] = useState("");

  // TEMP IN THIS FILE
  const getUser = async () => {
    const { data } = await authClient.getSession();
    if (data) {
      setUserName(data.user.name);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="h-6 w-full bg-fixed bg-top backdrop-blur-3xl pretty-background flex items-center justify-between gap-4 p-2 sticky top-0 z-10">
      {children}

      {/* TEMP */}
      <Link to="/logout">
        <span className="text-bold text-xs text-white">{userName}</span>
      </Link>
    </div>
  );
};

export default HeaderMenu;
