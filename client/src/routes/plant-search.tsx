import { createFileRoute } from "@tanstack/react-router";
import PlantSearch from "pages/PlantSearch";

export const Route = createFileRoute("/plant-search")({
  component: PlantSearch,
});
