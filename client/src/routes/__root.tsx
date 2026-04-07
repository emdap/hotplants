import { createRootRoute, redirect } from "@tanstack/react-router";
import App from "App";

export const Route = createRootRoute({
  component: App,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/browse-plants",
        replace: true,
      });
    }
  },
});
