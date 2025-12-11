import { authClient } from "auth/auth-client";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login");
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

export default Logout;
