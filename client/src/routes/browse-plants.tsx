import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import EntitySearchProvider from "contexts/entitySearch/EntitySearchProvider";
import SearchParamsProvider from "contexts/searchParams/SearchParamsProvider";
import {
  DEFAULT_PLANT_SEARCH_ROUTE_PARAMS,
  validatePlantSearchParams,
} from "util/routeParamsUtil";

const BrowsePlantsRoute = () => (
  <SearchParamsProvider>
    <EntitySearchProvider />
  </SearchParamsProvider>
);

export const Route = createFileRoute("/browse-plants")({
  component: BrowsePlantsRoute,
  search: {
    middlewares: [
      retainSearchParams(["lastOpened"]),
      stripSearchParams(DEFAULT_PLANT_SEARCH_ROUTE_PARAMS),
    ],
  },
  validateSearch: validatePlantSearchParams,
});
