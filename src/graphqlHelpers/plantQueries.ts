import { graphql } from "generated/graphql";
import { SearchPlantsQuery } from "generated/graphql/graphql";

export const SEARCH_PLANTS = graphql(`
  query searchPlants(
    $limit: Int
    $offset: Int
    $sort: SortInput
    $where: PlantDataInput
  ) {
    plantSearch(limit: $limit, offset: $offset, sort: $sort, where: $where) {
      count
      results {
        scientificName
        commonNames
        bloomColors
        bloomTimes
        physicalCharactersticsDump

        mediaUrls {
          url
          occurrenceId
        }
      }
    }
  }
`);

export const GET_SEARCH_RECORD = graphql(`
  query getSearchRecord($searchId: String!) {
    searchRecord(id: $searchId) {
      status
      totalOccurrences
      endOfRecords
    }
  }
`);

export type PlantQueryResults = SearchPlantsQuery["plantSearch"]["results"];
export type PlantResult = PlantQueryResults[number];
