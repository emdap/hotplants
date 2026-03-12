import { DefaultError, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAppContext } from "contexts/AppContext";

export const useReactQuery = <TData, TError = DefaultError>(
  options: UseQueryOptions<TData, TError>,
) => {
  const { serverReady } = useAppContext();
  return useQuery({
    ...options,
    enabled: serverReady && (options.enabled ?? true),
  });
};

export {
  useMutation as useApolloMutation,
  useQuery as useApolloQuery,
} from "@apollo/client/react";
export { useMutation as useReactMutation } from "@tanstack/react-query";
