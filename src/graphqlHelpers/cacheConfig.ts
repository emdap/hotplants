import { InMemoryCache } from "@apollo/client";
import { PlantSearchResults } from "generated/graphql/graphql";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        plantSearch: {
          keyArgs: false,
          merge: (
            existing: PlantSearchResults = { count: 0, results: [] },
            incoming: PlantSearchResults
          ) => ({
            count: incoming.count,
            results: existing.results.concat(incoming.results),
          }),
        },
      },
    },
  },
});
