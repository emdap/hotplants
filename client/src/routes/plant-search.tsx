import {
  createFileRoute,
  retainSearchParams,
  stripSearchParams,
} from "@tanstack/react-router";
import PlantSearchProvider from "contexts/plantSearch/PlantSearchProvider";
import {
  DEFAULT_PLANT_SEARCH_ROUTE_PARAMS,
  validatePlantSearchParams,
} from "util/routeParamsUtil";

export const Route = createFileRoute("/plant-search")({
  component: PlantSearchProvider,
  search: {
    middlewares: [
      ({ search, next }) => {
        const nextSearch = next(search);

        return nextSearch.search
          ? nextSearch
          : DEFAULT_PLANT_SEARCH_ROUTE_PARAMS;
      },
      retainSearchParams(true),
      stripSearchParams(DEFAULT_PLANT_SEARCH_ROUTE_PARAMS),
    ],
  },
  validateSearch: validatePlantSearchParams,
});
