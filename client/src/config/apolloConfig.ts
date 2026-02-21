import {
  ApolloClient,
  FieldFunctionOptions,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
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

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
    credentials: "include",
  }),
  cache,
});
