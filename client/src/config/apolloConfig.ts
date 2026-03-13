import {
  ApolloClient,
  ApolloLink,
  FieldFunctionOptions,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
  Observable,
  Reference,
} from "@apollo/client";
import {
  PlantOccurrence,
  SearchPlantsQueryVariables,
} from "generated/graphql/graphql";

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
let pendingListeners: Set<() => void> | null = new Set();
export const setApolloReady = () => {
  pendingListeners?.forEach((fn) => fn());
  pendingListeners = null;
};

export const readinessLink = new ApolloLink((operation, forward) => {
  if (pendingListeners === null) {
    return forward(operation);
  }

  return new Observable((observer) => {
    const onReady = () => forward(operation).subscribe(observer);

    pendingListeners?.add(onReady);
    return () => pendingListeners?.delete(onReady);
  });
});

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_PROXY_SERVER_URL}/graphql`,
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([readinessLink, httpLink]),
  cache,
});
