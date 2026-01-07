import { graphql } from "generated/graphql";
import { GetAllSearchRecordsQuery } from "generated/graphql/graphql";

export const GET_ALL_SEARCH_RECORDS = graphql(`
  query getAllSearchRecords {
    allSearchRecords {
      count
      results {
        createdTimestamp
        status
        statusUpdatedTimestamp

        locationName
        boundingPolyCoords
        scientificName
        commonName

        totalOccurrences
        occurrencesOffset
      }
    }
  }
`);

export type SearchRecordResult =
  GetAllSearchRecordsQuery["allSearchRecords"]["results"][number];
