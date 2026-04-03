import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  authClient,
  LoginParams,
  SignupParams,
  useAuthSession,
} from "config/authConfig";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { capitalize } from "lodash";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { defaultErrorToast } from "util/toastUtil";

const DEFAULT_LOGIN_INFO: LoginParams = { email: "", password: "" };

const DEFAULT_SIGNUP_INFO: SignupParams = {
  name: "",
  email: "",
  password: "",
};

const FORM_LABELS = {
  login: { header: "Log In", switch: "I need an account", button: "Submit" },
  signup: {
    header: "Sign Up",
    switch: "I already have an account",
    button: "Create Account",
  },
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authSession = useAuthSession();

  const [loading, setLoading] = useState(false);
  const [useForm, setUseForm] = useState<"login" | "signup">(
    location.pathname.includes("signup") ? "signup" : "login",
  );

  const [formInfo, setFormInfo] = useState({
    login: DEFAULT_LOGIN_INFO,
    signup: DEFAULT_SIGNUP_INFO,
  });

  const formComplete = useMemo(
    () => Object.values(formInfo[useForm]).every((val) => val.length),
    [useForm, formInfo],
  );

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!formComplete) {
      return;
    }

    setLoading(true);
    const formData = formInfo[useForm];

    try {
      const { error } = await (useForm === "login"
        ? authClient.signIn.email(formData)
        : authClient.signUp.email(formData as SignupParams));

      if (error) {
        toast.error(error.message);
      } else {
        const nextPath = location.pathname.includes("login")
          ? "/browse-plants"
          : ".";
        navigate({ to: nextPath, search: (prev) => prev, replace: true });
      }
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }

    setLoading(false);
  };

  return (
    <Card className="w-7/8 mt-10 md:w-md">
      <form onSubmit={submitForm} className="space-y-10">
        <h2>{FORM_LABELS[useForm].header}</h2>
        <div className="space-y-4">
          {Object.entries(formInfo[useForm]).map(([key, value]) => (
            <div className="form-item" key={key}>
              <label className="label" htmlFor={key}>
                {capitalize(key)}
              </label>
              <input
                type={key}
                value={value}
                onChange={({ target }) =>
                  setFormInfo((prev) => ({
                    ...prev,
                    [useForm]: { ...prev[useForm], [key]: target.value },
                  }))
                }
                className="styled-input"
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          isLoading={
            loading || authSession.isPending || authSession.isRefetching
          }
        >
          {FORM_LABELS[useForm].button}
        </Button>

        <Button
          variant="text-primary"
          type="button"
          className="ml-auto dark:text-white/80"
          onClick={() => setUseForm(useForm === "login" ? "signup" : "login")}
        >
          {FORM_LABELS[useForm].switch} {">"}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
