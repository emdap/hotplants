import { createFileRoute } from "@tanstack/react-router";
import UserGardens from "pages/UserGardens";

export const Route = createFileRoute("/_private/gardens/{-$gardenName}")({
  component: UserGardens,
});
