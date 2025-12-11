import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Card from "components/designSystem/Card";
import LoadingIcon from "components/designSystem/LoadingIcon";
import { useEffect } from "react";
import { authClient } from "util/authClient";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/login" });
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="flex gap-2 items-center">
        <LoadingIcon />
        Logging you out
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/logout")({
  component: Logout,
});
