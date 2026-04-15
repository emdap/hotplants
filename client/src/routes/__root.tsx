import { createRootRoute, redirect } from "@tanstack/react-router";
import App from "App";
import { PLANTS_WITH_DATA_FILTER } from "components/entityForms/entityFilters/entityFilterUtil";

export const Route = createRootRoute({
  component: App,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/browse-plants",
        replace: true,
        search: PLANTS_WITH_DATA_FILTER,
      });
    }
  },
});
