import { SearchRecordSortField } from "generated/graphql/graphql";

export const SEARCH_RECORD_ORDERED_SORT_KEYS: SearchRecordSortField[] = [
  "locationName",
  "totalOccurrences",
  "createdTimestamp",
  "statusUpdatedTimestamp",
];

export const SEARCH_RECORD_SORT_LABELS: Record<SearchRecordSortField, string> =
  {
    locationName: "Location name",
    totalOccurrences: "Total occurrences",
    createdTimestamp: "Search created",
    statusUpdatedTimestamp: "Search last ran",
  };
