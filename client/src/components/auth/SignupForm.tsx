import { useNavigate } from "@tanstack/react-router";
import { authClient, SignupParams } from "config/authClient";
import Button from "designSystem/Button";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import AuthFormCard from "./AuthFormCard";
import AuthLoadingSubmitButton from "./AuthLoadingSubmitButton";

const DEFAULT_USER_INFO: SignupParams = {
  name: "",
  email: "",
  password: "",
};

const SignupForm = ({
  onClickExistingAccount,
}: {
  onClickExistingAccount?: () => void;
}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(DEFAULT_USER_INFO);

  const formComplete = useMemo(
    () => Object.values(userInfo).every((val) => val.length),
    [userInfo]
  );

  const createUser = async () => {
    const { error } = await authClient.signUp.email(userInfo);
    if (error) {
      window.alert(error.message);
    } else {
      navigate({
        to: "/plant-search",
        replace: true,
      });
    }
  };

  const handleClickExistingAccount = () =>
    onClickExistingAccount
      ? onClickExistingAccount()
      : navigate({ to: "/login", replace: true });

  return (
    <AuthFormCard>
      <h2>Sign Up</h2>
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

      <AuthLoadingSubmitButton
        disabled={!formComplete}
        variant="primary"
        onClick={createUser}
      >
        Create Account
      </AuthLoadingSubmitButton>
      <Button
        variant="text"
        className="ml-auto max-md:mt-8"
        onClick={handleClickExistingAccount}
      >
        I already have an account {">"}
      </Button>
    </AuthFormCard>
  );
};

export default SignupForm;
