import { createRouter, Navigate } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <Navigate to="/plant-search" replace />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
