import { createFileRoute, Outlet } from "@tanstack/react-router";
import LoginForm from "components/LoginForm";
import { useAuthSession } from "config/authConfig";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";

const PrivateRoute = () => {
  const session = useAuthSession();
  const { serverReady } = useServerReadyContext();

  return !serverReady ? (
    <LoadingOverlay show className="h-dvh-header" transparent />
  ) : session.isPending ? null : session.data?.session ? (
    <Outlet />
  ) : (
    <div className="w-full flex flex-col items-center gap-10 py-10">
      <Card className="mx-auto space-y-8 md:w-xl text-center -mb-8">
        <h2>Account Required</h2>
        <p>You'll need an account to access this page.</p>
      </Card>
      <LoginForm />
    </div>
  );
};

export const Route = createFileRoute("/_private")({
  component: PrivateRoute,
});
