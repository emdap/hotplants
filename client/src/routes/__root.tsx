import {
  createRootRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router";
import App from "App";
import {
  DEFAULT_PLANT_SEARCH_PARAMS,
  validatePlantSearchParams,
} from "util/routeParamsUtil";

export const Route = createRootRoute({
  component: App,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/plant-search",
        replace: true,
      });
    }
  },
  search: { middlewares: [stripSearchParams(DEFAULT_PLANT_SEARCH_PARAMS)] },
  validateSearch: validatePlantSearchParams,
});
