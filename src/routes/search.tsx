import { createFileRoute } from "@tanstack/react-router";
import PlantSearch from "pages/PlantSearch";

export const Route = createFileRoute("/search")({
  component: PlantSearch,
});
