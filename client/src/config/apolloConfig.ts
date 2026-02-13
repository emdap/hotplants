import {
  ApolloClient,
  FieldFunctionOptions,
  FieldMergeFunction,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  PlantOccurrence,
  PlantSearchQueryResults,
  SearchPlantsQueryVariables,
} from "generated/graphql/graphql";

const mergePlantSearch: FieldMergeFunction<
  PlantSearchQueryResults,
  PlantSearchQueryResults,
  FieldFunctionOptions<
    SearchPlantsQueryVariables,
    SearchPlantsQueryVariables & { paginated?: boolean }
  >
> = (existing, incoming, { variables }) => {
  if (!existing?.results || !variables?.offset) {
    return incoming;
  }

  return {
    count: incoming.count,
    results: existing.results.concat(incoming.results),
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
