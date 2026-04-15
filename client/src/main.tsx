import { ApolloProvider } from "@apollo/client/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { apolloClient } from "config/apolloConfig";
import { queryClient } from "config/queryClientConfig";
import { ServerReadyProvider } from "contexts/serverReady/ServerReadyProvider";
import DarkModeProvider from "designSystem/darkMode/DarkModeProvider";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { router } from "router";
import "styles/index.css";

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <ServerReadyProvider>
            <DarkModeProvider>
              <RouterProvider router={router} />
            </DarkModeProvider>
          </ServerReadyProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
