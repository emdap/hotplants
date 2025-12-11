import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthLayout = () => (
  <div className="h-full w-full flex items-center justify-center">
    <Outlet />
  </div>
);

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
