import { Outlet } from "@tanstack/react-router";
import HeaderMenu from "components/header/HeaderMenu";
import { authClient } from "config/authClient";
import PlantSearchProvider from "contexts/plantSearch/PlantSearchProvider";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <PlantSearchProvider>
      <div className="fixed -z-10 h-dvh w-[calc(100dvw+20px)] pretty-background"></div>
      <HeaderMenu />

      <Outlet />
    </PlantSearchProvider>
  );
};

export default App;
