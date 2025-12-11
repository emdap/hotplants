import { createRouter } from "@tanstack/react-router";
import PlantSearch from "pages/PlantSearch";
import "./index.css";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: PlantSearch,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
