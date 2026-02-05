import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { apolloClient } from "config/apolloConfig";
import DarkModeProvider from "designSystem/darkMode/DarkModeProvider";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { router } from "router";
import "styles/index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <DarkModeProvider>
            <RouterProvider router={router} />
          </DarkModeProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
