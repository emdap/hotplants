import { createFileRoute } from "@tanstack/react-router";
import Garden from "pages/Garden";
import { validateGardenParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/_private/gardens/$gardenName")({
  component: Garden,
  validateSearch: validateGardenParams,
});
