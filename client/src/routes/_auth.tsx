import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";
import LoadingOverlay from "designSystem/LoadingOverlay";

const AuthLayout = () => {
  const { serverReady } = useServerReadyContext();

  return serverReady ? (
    <div className="h-full w-full flex items-center justify-center">
      <Outlet />
    </div>
  ) : (
    <LoadingOverlay show className="h-dvh-header" transparent />
  );
};

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});
