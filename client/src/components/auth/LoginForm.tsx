import { useLocation, useNavigate } from "@tanstack/react-router";
import SignupForm from "components/auth/SignupForm";
import Button from "components/designSystem/Button";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import { authClient, LoginParams } from "util/authClient";
import AuthFormCard from "./AuthFormCard";
import AuthLoadingSubmitButton from "./AuthLoadingSubmitButton";

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

  return showForm === "login" ? (
    <AuthFormCard>
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

      <AuthLoadingSubmitButton
        disabled={!formComplete}
        variant="primary"
        onClick={loginUser}
      >
        Submit
      </AuthLoadingSubmitButton>
      <Button
        variant="text"
        className="ml-auto max-md:mt-8"
        onClick={() => setShowForm("signup")}
      >
        I need an account {">"}
      </Button>
    </AuthFormCard>
  ) : (
    <SignupForm onClickExistingAccount={() => setShowForm("login")} />
  );
};

export default LoginForm;
