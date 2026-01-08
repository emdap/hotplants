import { createFileRoute, Link } from "@tanstack/react-router";
import AuthFormCard from "components/auth/AuthFormCard";
import AuthLoadingSubmitButton from "components/auth/AuthLoadingSubmitButton";
import { authClient, useAuthSession } from "config/authClient";
import Button from "designSystem/Button";
import LoadingIcon from "designSystem/LoadingIcon";
import { useEffect } from "react";

const Logout = () => {
  const session = useAuthSession();

  useEffect(() => {
    authClient.signOut();
  }, []);

  return (
    <AuthFormCard>
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
            <Link to={".."} replace className="flex flex-grow">
              <Button variant="primary" className="max-w-full w-full">
                Back
              </Button>
            </Link>
            <Link to={"/login"} className="flex-grow" replace>
              <Button variant="secondary" className="max-w-full w-full">
                Go to Log In page
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="font-medium">Sign out was not successful.</div>
          <AuthLoadingSubmitButton
            variant="primary"
            onClick={() => authClient.signOut()}
          >
            Try Again
          </AuthLoadingSubmitButton>
        </>
      )}
    </AuthFormCard>
  );
};

export const Route = createFileRoute("/_auth/logout")({
  component: Logout,
});
