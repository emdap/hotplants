import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DarkModeToggle from "./components/DarkModeToggle";
import PlantSearch from "./components/PlantSearch/PlantSearch2";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_SERVER }),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <div className="h-dvh flex flex-col">
          <DarkModeToggle />
          <PlantSearch />
        </div>
      </ApolloProvider>
    </QueryClientProvider>
  );
};

export default App;
