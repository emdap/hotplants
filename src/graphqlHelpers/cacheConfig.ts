import {
  FieldFunctionOptions,
  FieldMergeFunction,
  InMemoryCache,
} from "@apollo/client";
import {
  PlantSearchResults,
  SearchPlantsQueryVariables,
} from "generated/graphql/graphql";

const mergeFunction: FieldMergeFunction<
  PlantSearchResults,
  PlantSearchResults,
  FieldFunctionOptions<SearchPlantsQueryVariables, SearchPlantsQueryVariables>
> = (existing, incoming: PlantSearchResults, { variables }) => {
  const count = incoming.count;
  const baseResults =
    variables?.offset && existing?.results ? existing.results : [];
  return {
    count,
    results: baseResults.concat(incoming.results),
  };
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        plantSearch: {
          keyArgs: ["where", "sort"],
          merge: mergeFunction,
        },
      },
    },
  },
});
