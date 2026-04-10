import {
  ApolloClient,
  ApolloLink,
  FieldFunctionOptions,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  makeVar,
  Observable,
  Reference,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import {
  PlantOccurrence,
  SearchPlantsQueryVariables,
} from "generated/graphql/graphql";
import { FormattedExecutionResult } from "graphql";

type PlantSearchCachedData = { count: number; results: Reference[] };

const mergePlantSearch: FieldMergeFunction<
  PlantSearchCachedData,
  PlantSearchCachedData,
  FieldFunctionOptions<
    SearchPlantsQueryVariables,
    SearchPlantsQueryVariables & { paginated?: boolean }
  >
> = (existing, incoming, { readField, variables }) => {
  if (!existing?.results || !variables?.offset) {
    return incoming;
  }

  const existingIds = new Set(
    existing?.results.map((ref) => readField("_id", ref)),
  );
  const newResults = incoming.results.filter(
    (ref) => !existingIds.has(readField("_id", ref)),
  );

  return {
    count: incoming.count,
    results: existing.results.concat(newResults),
  };
};

const mergeOccurrences: FieldMergeFunction<
  PlantOccurrence[],
  PlantOccurrence[]
> = (_existing, incoming) => incoming;

const cache = new InMemoryCache({
  possibleTypes: {
    PlantDataInterface: ["PlantData", "GardenPlantData"],
  },
  typePolicies: {
    Query: {
      fields: {
        plantSearch: {
          keyArgs: (_args, { variables }) =>
            variables?.paginated
              ? ["offset", "limit", "where", "sort"]
              : ["where", "sort"],
          merge: mergePlantSearch,
        },
      },
    },
    PlantData: {
      fields: {
        occurrences: {
          merge: mergeOccurrences,
        },
      },
    },
  },
});

// Want to pause GraphQl requests until both my proxy server and BE are up-and-running
// prod servers auto shut down, and take longer to wake up than the FE
export const apolloReady = makeVar(false);
let pendingListeners: Set<() => void> = new Set();

const addToPending = (
  operation: ApolloLink.Operation,
  forward: ApolloLink.ForwardFunction,
): Observable<FormattedExecutionResult> => {
  return new Observable((observer) => {
    const onReady = () => forward(operation).subscribe(observer);

    pendingListeners.add(onReady);
    return () => pendingListeners.delete(onReady);
  });
};

export const setApolloReady = (isReady: boolean) => {
  apolloReady(isReady);
  if (isReady) {
    pendingListeners?.forEach((fn) => fn());
    pendingListeners = new Set();
  }
};

export const readinessLink = new ApolloLink((operation, forward) => {
  if (apolloReady()) {
    return forward(operation);
  }

  return addToPending(operation, forward);
});

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_PROXY_SERVER_URL}/graphql`,
  credentials: "include",
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (error.message === "Failed to fetch") {
    setApolloReady(false);
    return addToPending(operation, forward);
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([readinessLink, errorLink, httpLink]),
  cache,
});
