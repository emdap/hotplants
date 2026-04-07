import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import LoginForm from "components/LoginForm";

export const Route = createFileRoute("/_auth/login")({
  component: LoginForm,
  search: {
    middlewares: [retainSearchParams(true)],
  },
});
