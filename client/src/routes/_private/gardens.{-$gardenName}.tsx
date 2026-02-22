import { createFileRoute } from "@tanstack/react-router";
import UserGardens from "pages/UserGardens";
import { validatePaginationParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/_private/gardens/{-$gardenName}")({
  component: UserGardens,
  validateSearch: validatePaginationParams,
});
