import {
  FieldFunctionOptions,
  FieldMergeFunction,
  InMemoryCache,
} from "@apollo/client";
import {
  PlantOccurrence,
  PlantSearchResults,
  SearchPlantsQueryVariables,
} from "generated/graphql/graphql";

const mergePlantSearch: FieldMergeFunction<
  PlantSearchResults,
  PlantSearchResults,
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

export const cache = new InMemoryCache({
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
