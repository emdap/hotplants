import { Outlet } from "@tanstack/react-router";
import AppSidebar from "components/navigation/AppSidebar";
import AppHeader from "components/navigation/header/AppHeader";
import { authClient } from "config/authClient";
import PlantSearchProvider from "contexts/plantSearch/PlantSearchProvider";
import { useEffect, useState } from "react";
import { BACKGROUND_ANIMATION_ID } from "util/generalUtil";

const App = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <PlantSearchProvider>
      <div
        id={BACKGROUND_ANIMATION_ID}
        className="fixed -z-10 h-dvh w-dvw pretty-background"
      />
      <AppHeader openSidebar={() => setSidebarExpanded(true)} />
      <div className="flex [&_main]:grow">
        <AppSidebar
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
        />
        <Outlet />
      </div>
    </PlantSearchProvider>
  );
};

export default App;
