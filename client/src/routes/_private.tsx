import { createFileRoute, Outlet } from "@tanstack/react-router";
import LoginForm from "components/auth/LoginForm";
import { useAuthSession } from "config/authClient";
import Card from "designSystem/Card";

const PrivateRoute = () => {
  const session = useAuthSession();

  return session.isPending ? null : session.data?.session ? (
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
