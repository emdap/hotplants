import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlantSearch from "pages/PlantSearch";

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
        <div className="h-dvh">
          <PlantSearch />
        </div>
      </ApolloProvider>
    </QueryClientProvider>
  );
};

export default App;
