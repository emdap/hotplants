import { createRouter, Navigate } from "@tanstack/react-router";
import { PLANTS_WITH_DATA_FILTER } from "components/entityForms/entityFilters/entityFilterUtil";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <Navigate to="/browse-plants" search={PLANTS_WITH_DATA_FILTER} replace />
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
