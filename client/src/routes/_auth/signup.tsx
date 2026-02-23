import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "components/LoginForm";

export const Route = createFileRoute("/_auth/signup")({
  component: LoginForm,
});
