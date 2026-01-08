import { Outlet } from "@tanstack/react-router";
import AppHeader from "components/navigation/header/AppHeader";
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
      <AppHeader openSidebar={() => setSidebarExpanded(true)} />
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
