import { authClient } from "auth/auth-client";
import DarkModeToggle from "components/DarkModeToggle";
import HeaderMenu from "designSystem/HeaderMenu";
import { useEffect } from "react";
import { Outlet } from "react-router";

const App = () => {
  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <>
      <div className="fixed -z-10 h-dvh w-[calc(100dvw+20px)] pretty-background"></div>

      <HeaderMenu>
        <DarkModeToggle />
      </HeaderMenu>
      <Outlet />
    </>
  );
};

export default App;
