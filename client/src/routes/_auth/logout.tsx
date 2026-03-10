import {
  createFileRoute,
  Link,
  retainSearchParams,
} from "@tanstack/react-router";
import { authClient, useAuthSession } from "config/authClient";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultErrorToast } from "util/toastUtil";

const Logout = () => {
  const session = useAuthSession();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message ?? "Unexpected error occurred.");
      }
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
    setLoading(false);
  };

  useEffect(() => {
    onLogout();
  }, []);

  return (
    <Card className="mt-10 space-y-10">
      {session.isPending ? (
        <div className="flex gap-4 items-center">
          <LoadingIcon />
          Logging you out
        </div>
      ) : !session.data ? (
        <>
          <p className="font-medium font-lg">
            You've been successfully signed out.
          </p>
          <div className="w-full flex gap-4 justify-center">
            <Link
              to="/plant-search"
              search={(prev) => prev}
              replace
              className="flex flex-grow"
            >
              <Button variant="primary" className="max-w-full w-full">
                Go to Plant search
              </Button>
            </Link>
            <Link to={"/login"} className="flex-grow" replace>
              <Button variant="secondary" className="max-w-full w-full">
                Go to Log In
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="font-medium">Sign out was not successful.</div>
          <Button variant="primary" onClick={onLogout} isLoading={loading}>
            Try Again
          </Button>
        </>
      )}
    </Card>
  );
};

export const Route = createFileRoute("/_auth/logout")({
  component: Logout,
  search: {
    middlewares: [retainSearchParams(true)],
  },
});
