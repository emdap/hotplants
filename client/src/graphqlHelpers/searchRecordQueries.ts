import { graphql } from "generated/graphql";
import { GetAllSearchRecordsQuery } from "generated/graphql/graphql";

export const GET_ALL_SEARCH_RECORDS = graphql(`
  query getAllSearchRecords {
    allSearchRecords {
      count
      results {
        _id
        createdTimestamp
        status
        statusUpdatedTimestamp

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
  query getSearchRecordPlantCount($id: String!) {
    searchRecordPlantCount(id: $id)
  }
`);

export type SearchRecordResult =
  GetAllSearchRecordsQuery["allSearchRecords"]["results"][number];
