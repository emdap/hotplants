import { createFileRoute, Link } from "@tanstack/react-router";
import Button from "components/designSystem/Button";
import Card from "components/designSystem/Card";
import LoadingIcon from "components/designSystem/LoadingIcon";
import { useEffect } from "react";
import { authClient, useAuthSession } from "util/authClient";

const Logout = () => {
  const session = useAuthSession();

  useEffect(() => {
    authClient.signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="space-y-10 w-md">
      {session.isPending ? (
        <div className="flex gap-4">
          <LoadingIcon />
          Logging you out
        </div>
      ) : !session.data ? (
        <>
          <p className="font-medium font-lg">
            You've been successfully signed out.
          </p>
          <div className="flex gap-4">
            <Link to={".."} replace>
              <Button variant="primary">Back</Button>
            </Link>
            <Link to={"/login"} replace>
              <Button variant="secondary">Go to Log In page</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h4>Sign out was not successful.</h4>
          <Button variant="primary" onClick={() => authClient.signOut()}>
            Try Again
          </Button>
        </>
      )}
    </Card>
  );
};

export const Route = createFileRoute("/_auth/logout")({
  component: Logout,
});
