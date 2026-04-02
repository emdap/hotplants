import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import AppSidebar from "components/navigation/AppSidebar";
import AppHeader from "components/navigation/header/AppHeader";
import { apolloClient, setApolloReady } from "config/apolloConfig";
import { authClient } from "config/authConfig";
import { AppContext } from "contexts/AppContext";
import { useDarkMode } from "designSystem/darkMode/DarkModeContext";
import { useWakeUpServers } from "hooks/useWakeUpServers";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { BACKGROUND_ANIMATION_ID } from "util/generalUtil";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App = () => {
  const { isDarkMode } = useDarkMode();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const serverReady = useWakeUpServers();

  useEffect(() => {
    if (serverReady === true) {
      setApolloReady();
      authClient.getSession();
    }
  }, [serverReady]);

  return (
    <AppContext.Provider
      value={{
        sidebarExpanded,
        setSidebarExpanded,
        serverReady,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
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
        </ApolloProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;
