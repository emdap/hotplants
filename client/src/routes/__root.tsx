import { createRootRoute, redirect } from "@tanstack/react-router";
import App from "App";

export const Route = createRootRoute({
  component: App,
  beforeLoad: ({ location }) => {
    document.documentElement.scrollTo({ top: 0, behavior: "instant" });
    document.body.scrollTo({ top: 0, behavior: "instant" });

    if (location.pathname === "/") {
      throw redirect({
        to: "/plant-search",
        replace: true,
      });
    }
  },
});
