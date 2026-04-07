import { createFileRoute } from "@tanstack/react-router";
import SearchParamsProvider from "contexts/searchParams/SearchParamsProvider";
import NewSearch from "pages/NewSearch";

const NewSearchRoute = () => (
  <SearchParamsProvider>
    <NewSearch />
  </SearchParamsProvider>
);

export const Route = createFileRoute("/new-search")({
  component: NewSearchRoute,
});
