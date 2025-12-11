import DarkModeToggle from "components/DarkModeToggle";
import HeaderMenu from "components/designSystem/HeaderMenu";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { authClient } from "util/authClient";

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
