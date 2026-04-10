import { Outlet } from "@tanstack/react-router";
import AppSidebar from "components/navigation/AppSidebar";
import AppHeader from "components/navigation/header/AppHeader";
import { authClient } from "config/authConfig";
import { AppContext } from "contexts/AppContext";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";
import { useDarkMode } from "designSystem/darkMode/DarkModeContext";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { BACKGROUND_ANIMATION_ID } from "util/generalUtil";

const App = () => {
  const { isDarkMode } = useDarkMode();
  const { serverReady } = useServerReadyContext();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    if (serverReady) {
      authClient.getSession();
    }
  }, [serverReady]);

  return (
    <AppContext.Provider
      value={{
        sidebarExpanded,
        setSidebarExpanded,
      }}
    >
      <div
        id={BACKGROUND_ANIMATION_ID}
        className="fixed -z-10 h-dvh w-dvw pretty-background"
      />
      <Toaster
        theme={isDarkMode ? "dark" : "light"}
        richColors
        toastOptions={{
          classNames: {
            error: "bg-orange-100",
          },
        }}
      />
      <AppHeader />
      <div className="flex [&_main]:grow">
        <AppSidebar />
        <Outlet />
      </div>
    </AppContext.Provider>
  );
};

export default App;
