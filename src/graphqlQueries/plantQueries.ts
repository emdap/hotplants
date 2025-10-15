import { graphql } from "generated/graphql";
import { SearchPlantsQuery } from "generated/graphql/graphql";

export const SEARCH_PLANTS = graphql(`
  query searchPlants(
    $searchId: String!
    $limit: Int
    $offset: Int
    $sort: SortInput
    $where: PlantDataInput
  ) {
    searchRecords(id: $searchId) {
      status
    }

    plants(limit: $limit, offset: $offset, sort: $sort, where: $where) {
      scientificName
      commonNames
      mediaUrls
      bloomColors
      bloomTimes
    }
  }
`);

export type PlantResult = SearchPlantsQuery["plants"][number];
