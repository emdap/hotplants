import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DarkModeToggle from "./components/DarkModeToggle";
import PlantSearch from "./components/PlantSearch/PlantSearch";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-dvh flex flex-col">
        <DarkModeToggle />
        <PlantSearch />
      </div>
    </QueryClientProvider>
  );
};

export default App;
