import { graphql } from "generated/graphql";
import { SearchPlantsQuery } from "generated/graphql/graphql";

const _PLANT_FIELDS_FRAGMENT = graphql(
  `
    fragment PlantFields on PlantDataInterface {
      _id
      scientificName
      commonNames
      bloomColors
      bloomTimes
      isPerennial
      thumbnailUrl
      physicalCharactersticsDump
      scrapeSources

      fullOccurrencesCount
      occurrences {
        occurrenceId
        occurrenceCoords
        media {
          url
          isProxyUrl
        }
      }
    }
  `
);

export const GET_PLANT = graphql(`
  query getPlant($id: String!, $boundingPolyCoords: [[[Float!]!]!]) {
    plant(id: $id, boundingPolyCoords: $boundingPolyCoords) {
      ...PlantFields
    }
  }
`);

export const SEARCH_PLANTS = graphql(`
  query searchPlants(
    $limit: Int
    $offset: Int
    $sort: [SortInput!]
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
  mutation replaceWithProxyUrl(
    $plantId: String!
    $occurrenceId: Float!
    $replaceUrl: String!
  ) {
    replaceWithProxyUrl(
      plantId: $plantId
      occurrenceId: $occurrenceId
      replaceUrl: $replaceUrl
    )
  }
`);

export type PlantQueryResults = SearchPlantsQuery["plantSearch"]["results"];
export type PlantResult = PlantQueryResults[number];
