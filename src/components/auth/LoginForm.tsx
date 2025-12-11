import { useLocation, useNavigate } from "@tanstack/react-router";
import SignupForm from "components/auth/SignupForm";
import Button from "components/designSystem/Button";
import Card from "components/designSystem/Card";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import { authClient, LoginParams } from "util/authClient";

const DEFAULT_LOGIN_INFO: LoginParams = { email: "", password: "" };

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showForm, setShowForm] = useState<"login" | "signup">("login");
  const [loginInfo, setLoginInfo] = useState(DEFAULT_LOGIN_INFO);

  const formComplete = useMemo(
    () => Object.values(loginInfo).every((val) => val.length),
    [loginInfo]
  );

  const loginUser = async () => {
    const { error } = await authClient.signIn.email(loginInfo);
    if (error) {
      window.alert(error.message);
    } else {
      const nextPath = location.pathname === "/login" ? ".." : ".";
      navigate({ to: nextPath, replace: true });
    }
  };

  return (
    <div className="relative">
      {showForm === "login" ? (
        <Card key="login" className="space-y-10 w-md">
          <h2>Log In</h2>
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

          <Button
            disabled={!formComplete}
            variant="primary"
            onClick={loginUser}
          >
            Submit
          </Button>
          <Button
            variant="text"
            className="ml-auto"
            onClick={() => setShowForm("signup")}
          >
            I need an account {">"}
          </Button>
        </Card>
      ) : (
        <SignupForm onClickExistingAccount={() => setShowForm("login")} />
      )}
    </div>
  );
};

export default LoginForm;
