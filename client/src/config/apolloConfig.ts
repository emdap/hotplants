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
  FieldFunctionOptions<SearchPlantsQueryVariables, SearchPlantsQueryVariables>
> = (existing, incoming, { variables }) => {
  const count = incoming.count;
  const baseResults =
    variables?.offset && existing?.results ? existing.results : [];
  return {
    count,
    results: baseResults.concat(incoming.results),
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
          keyArgs: ["where", "sort"],
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
