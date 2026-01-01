import { Outlet } from "@tanstack/react-router";
import HeaderMenu from "components/navigation/header/HeaderMenu";
import NavSideBar from "components/navigation/sidebar/NavSidebar";
import { authClient } from "config/authClient";
import PlantSearchProvider from "contexts/plantSearch/PlantSearchProvider";
import { useEffect, useState } from "react";

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <PlantSearchProvider>
      <div className="fixed -z-10 h-dvh w-dvw pretty-background"></div>
      <HeaderMenu openSidebar={() => setSidebarExpanded(true)} />
      <div id="content-wrapper" className="flex [&_main]:grow">
        <NavSideBar
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
        />
        <Outlet />
      </div>
    </PlantSearchProvider>
  );
};

export default App;
