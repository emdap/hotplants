import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Button from "components/designSystem/Button";
import Card from "components/designSystem/Card";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import { authClient } from "util/authClient";

export type LoginInfo = {
  email: string;
  password: string;
};

const DEFAULT_LOGIN_INFO: LoginInfo = { email: "", password: "" };

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState<LoginInfo>(DEFAULT_LOGIN_INFO);

  const formComplete = useMemo(
    () => Object.values(loginInfo).every((val) => val.length),
    [loginInfo]
  );

  const loginUser = async () => {
    const { error } = await authClient.signIn.email(loginInfo);
    if (error) {
      window.alert(error.message);
    } else {
      navigate({ to: ".." });
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card className="space-y-10 w-md">
        <h2 className="text-default-text">Log In</h2>
        <div className="space-y-4">
          {Object.entries(loginInfo).map(([key, value]) => (
            <div className="form-item" key={key}>
              <label className="label" htmlFor={key}>
                {capitalize(key)}
              </label>
              <input
                type={key}
                value={value}
                onChange={({ target }) =>
                  setLoginInfo({ ...loginInfo, [key]: target.value })
                }
                className="styled-input"
              />
            </div>
          ))}
        </div>

        <Button disabled={!formComplete} variant="primary" onClick={loginUser}>
          Submit
        </Button>
      </Card>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: Login,
});
