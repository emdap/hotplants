import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_PROXY_SERVER_URL,
  basePath: "/auth",
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
});

export type SignupParams = Pick<
  Parameters<typeof authClient.signUp.email>[0],
  "name" | "email" | "password"
>;
export type LoginParams = Pick<
  Parameters<typeof authClient.signIn.email>[0],
  "email" | "password"
>;

export const useAuthSession = () => authClient.useSession();
export const useIsSignedIn = () => {
  const session = useAuthSession();
  return Boolean(session.data);
};
