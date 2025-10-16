import { graphql } from "generated/graphql";
import { SearchPlantsQuery } from "generated/graphql/graphql";

export const SEARCH_PLANTS = graphql(`
  query searchPlants(
    $limit: Int
    $offset: Int
    $sort: SortInput
    $where: PlantDataInput
  ) {
    plants(limit: $limit, offset: $offset, sort: $sort, where: $where) {
      count
      results {
        scientificName
        commonNames
        mediaUrls
        bloomColors
        bloomTimes
      }
    }
  }
`);

export const GET_SEARCH_RECORD = graphql(`
  query getSearchRecord($searchId: String!) {
    searchRecord(id: $searchId) {
      status
      totalOccurrences
      uniqueOccurrences
      endOfRecords
    }
  }
`);

export type PlantQueryResults = SearchPlantsQuery["plants"]["results"];
export type PlantResult = PlantQueryResults[number];
