import { Outlet } from "@tanstack/react-router";
import HeaderMenu from "components/header/HeaderMenu";
import NavSideBar from "components/navSidebar/NavSidebar";
import NavSidebarButton from "components/navSidebar/NavSidebarButton";
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
      <HeaderMenu>
        <NavSidebarButton openSidebar={() => setSidebarExpanded(true)} />
      </HeaderMenu>

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
