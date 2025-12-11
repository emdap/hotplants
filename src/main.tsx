import { ApolloClient, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "AppRoutes.tsx";
import { cache } from "graphqlHelpers/cacheConfig";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${import.meta.env.VITE_SERVER_URL}/graphql` }),
  cache,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ApolloProvider>
    </QueryClientProvider>
  </StrictMode>
);
