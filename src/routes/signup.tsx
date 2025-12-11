import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Button from "components/designSystem/Button";
import Card from "components/designSystem/Card";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import { authClient } from "util/authClient";
import { LoginInfo } from "./login";

type UserInfo = LoginInfo & {
  name: string;
};

const DEFAULT_USER_INFO: UserInfo = { name: "", email: "", password: "" };

const Signup = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>(DEFAULT_USER_INFO);

  const formComplete = useMemo(
    () => Object.values(userInfo).every((val) => val.length),
    [userInfo]
  );

  const createUser = async () => {
    const { error } = await authClient.signUp.email(userInfo);
    if (error) {
      window.alert(error.message);
    } else {
      navigate({ to: "/search" });
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="space-y-10 w-md">
        <div className="space-y-4">
          {Object.entries(userInfo).map(([key, value]) => (
            <div className="form-item" key={key}>
              <label className="label" htmlFor={key}>
                {capitalize(key)}
              </label>
              <input
                value={value}
                onChange={({ target }) =>
                  setUserInfo({ ...userInfo, [key]: target.value })
                }
                className="styled-input"
              />
            </div>
          ))}
        </div>

        <Button disabled={!formComplete} variant="primary" onClick={createUser}>
          Signup
        </Button>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/signup")({
  component: Signup,
});
