import { graphql } from "generated/graphql";
import { SearchPlantsQuery } from "generated/graphql/graphql";

const _PLANT_FIELDS_FRAGMENT = graphql(
  `
    fragment PlantFields on PlantData {
      _id
      scientificName
      commonNames
      bloomColors
      bloomTimes
      physicalCharactersticsDump
      fullMediaCount

      mediaUrls {
        url
        occurrenceId
      }
    }
  `
);

export const GET_PLANT = graphql(`
  query getPlant($id: String!) {
    plant(id: $id) {
      ...PlantFields
    }
  }
`);

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
        ...PlantFields
      }
    }
  }
`);

export const REPLACE_WITH_PROXY_URL = graphql(`
  mutation replaceWithProxyUrl($plantId: String!, $replaceUrl: String!) {
    replaceWithProxyUrl(plantId: $plantId, replaceUrl: $replaceUrl)
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
