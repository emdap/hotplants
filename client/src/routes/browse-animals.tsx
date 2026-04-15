import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import EntitySearchProvider from "contexts/entitySearch/EntitySearchProvider";
import SearchParamsProvider from "contexts/searchParams/SearchParamsProvider";
import {
  DEFAULT_ANIMAL_SEARCH_ROUTE_PARAMS,
  validateAnimalSearchParams,
} from "util/routeParamsUtil";

const BrowseAnimalsRoute = () => (
  <SearchParamsProvider>
    <EntitySearchProvider entityType="animal" />
  </SearchParamsProvider>
);

export const Route = createFileRoute("/browse-animals")({
  component: BrowseAnimalsRoute,
  search: {
    middlewares: [
      retainSearchParams(["lastOpened"]),
      stripSearchParams(DEFAULT_ANIMAL_SEARCH_ROUTE_PARAMS),
    ],
  },
  validateSearch: validateAnimalSearchParams,
});
