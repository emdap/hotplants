import { createFileRoute } from "@tanstack/react-router";
import PreviousSearches from "pages/PreviousSearches";

export const Route = createFileRoute(
  "/previous-searches"
)({
  component: PreviousSearches,
});
