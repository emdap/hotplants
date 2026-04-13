import { graphql } from "generated/graphql";
import { GetAllSearchRecordsQuery } from "generated/graphql/graphql";

export const GET_ALL_SEARCH_RECORDS = graphql(`
  query getAllSearchRecords(
    $sort: [SearchRecordSortInput!]
    $limit: Int
    $offset: Int
    $booleanFilter: [SearchRecordBooleanFilterInput!]
    $stringFilter: [SearchRecordStringFilterInput!]
  ) {
    allSearchRecords(
      sort: $sort
      limit: $limit
      offset: $offset
      booleanFilter: $booleanFilter
      stringFilter: $stringFilter
    ) {
      count
      results {
        _id
        createdTimestamp
        status
        lastRanTimestamp

        entityType

        locationName
        locationSource
        boundingPolyCoords
        scientificName
        commonName

        totalOccurrences
        occurrencesOffset
      }
    }
  }
`);

export const GET_SEARCH_RECORD_PLANT_COUNT = graphql(`
  query getSearchRecordDataCounts($id: String!) {
    searchRecordDataCounts(id: $id) {
      plantCount
      occurrenceCount

      firstPlant {
        _id
        occurrenceId
        thumbnailUrl
        url
        isProxyUrl
      }
    }
  }
`);

export type SearchRecordResult =
  GetAllSearchRecordsQuery["allSearchRecords"]["results"][number];
