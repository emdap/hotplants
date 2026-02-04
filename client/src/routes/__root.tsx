import { createRootRoute, redirect } from "@tanstack/react-router";
import App from "App";

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
  // search: {
  //   middlewares: [stripSearchParams(DEFAULT_PLANT_SEARCH_ROUTE_PARAMS)],
  // },
  // validateSearch: validatePlantSearchParams,
});
