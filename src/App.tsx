import { Outlet } from "@tanstack/react-router";
import HeaderMenu from "components/HeaderMenu";
import { useEffect } from "react";
import { authClient } from "util/authClient";

const App = () => {
  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <>
      <div className="fixed -z-10 h-dvh w-[calc(100dvw+20px)] pretty-background"></div>
      <HeaderMenu />

      <Outlet />
    </>
  );
};

export default App;
