import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import PlantSearchProvider from "contexts/plantSearch/PlantSearchProvider";
import SearchParamsProvider from "contexts/searchParams/SearchParamsProvider";
import {
  DEFAULT_ANIMAL_SEARCH_ROUTE_PARAMS,
  validateAnimalSearchParams,
} from "util/routeParamsUtil";

const BrowseAnimalsRoute = () => (
  <SearchParamsProvider>
    <PlantSearchProvider entityType="animal" />
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
