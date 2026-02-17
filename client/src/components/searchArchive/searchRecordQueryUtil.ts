import {
  SearchRecordBooleanFilterField,
  SearchRecordBooleanFilterInput,
  SearchRecordSortField,
  SearchRecordSortInput,
  SearchRecordStringFilterField,
  SearchRecordStringFilterInput,
} from "generated/graphql/graphql";
import { SearchRecordFilterInput } from "util/routeParamsUtil";

export type SearchRecordQueryInput =
  | SearchRecordSortInput
  | SearchRecordFilterInput;

export const SEARCH_RECORD_ORDERED_SORT_KEYS: SearchRecordSortField[] = [
  "locationName",
  "totalOccurrences",
  "createdTimestamp",
  "statusUpdatedTimestamp",
];

export const SEARCH_RECORD_ORDERED_FILTER_KEYS: SearchRecordFilterInput["field"][] =
  ["locationSource", "status", "scientificName", "commonName"];

export const SEARCH_RECORD_SORT_LABELS: Record<SearchRecordSortField, string> =
  {
    locationName: "Location name",
    totalOccurrences: "Total occurrences",
    createdTimestamp: "Search created",
    statusUpdatedTimestamp: "Search last ran",
  };

export const SEARCH_RECORD_STRING_FILTER_LABELS: Record<
  SearchRecordStringFilterField,
  string
> = {
  locationSource: "Location source",
  status: "Search status",
};

export const SEARCH_RECORD_BOOLEAN_FILTER_LABELS: Record<
  SearchRecordBooleanFilterField,
  string
> = {
  scientificName: "Specifies scientific name",
  commonName: "Specifies common name",
};

export const SEARCH_RECORD_FILTER_LABELS = {
  ...SEARCH_RECORD_STRING_FILTER_LABELS,
  ...SEARCH_RECORD_BOOLEAN_FILTER_LABELS,
};

type FilterQueryVars = {
  booleanFilter?: SearchRecordBooleanFilterInput[];
  stringFilter?: SearchRecordStringFilterInput[];
};

export const parseFilterParams = (
  filter?: SearchRecordFilterInput[],
): FilterQueryVars | void =>
  filter?.reduce<FilterQueryVars>((prev, cur) => {
    if (cur.field in SEARCH_RECORD_STRING_FILTER_LABELS) {
      if (!prev.stringFilter) {
        prev.stringFilter = [];
      }
      prev.stringFilter.push(cur as SearchRecordStringFilterInput);
    } else if (cur.field in SEARCH_RECORD_BOOLEAN_FILTER_LABELS) {
      if (!prev.booleanFilter) {
        prev.booleanFilter = [];
      }
      prev.booleanFilter.push(cur as SearchRecordBooleanFilterInput);
    }
    return prev;
  }, {});
