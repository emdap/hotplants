import { DefaultError, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useServerReadyContext } from "contexts/serverReady/ServerReadyContext";

export const useReactQuery = <TData, TError = DefaultError>({
  ignoreServerReady,
  ...options
}: UseQueryOptions<TData, TError> & {
  ignoreServerReady?: boolean;
}) => {
  const { serverReady } = useServerReadyContext();
  return useQuery({
    ...options,
    enabled: Boolean(
      (ignoreServerReady || serverReady) && (options.enabled ?? true),
    ),
  });
};

export {
  useMutation as useApolloMutation,
  useQuery as useApolloQuery,
} from "@apollo/client/react";
export { useMutation as useReactMutation } from "@tanstack/react-query";
