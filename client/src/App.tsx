import { Outlet } from "@tanstack/react-router";
import AppSidebar from "components/navigation/AppSidebar";
import AppHeader from "components/navigation/header/AppHeader";
import { authClient } from "config/authClient";
import SidebarContextProvider from "contexts/sidebar/SidebarContextProvider";
import { useDarkMode } from "designSystem/darkMode/DarkModeContext";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { BACKGROUND_ANIMATION_ID } from "util/generalUtil";

const App = () => {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    authClient.getSession();
  }, []);

  return (
    <SidebarContextProvider>
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
    </SidebarContextProvider>
  );
};

export default App;
