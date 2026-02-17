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

export type ParamType = "sort" | "filter";

export const SEARCH_RECORD_ORDERED_QUERY_KEYS: {
  sort: SearchRecordSortField[];
  filter: SearchRecordFilterInput["field"][];
} = {
  sort: [
    "locationName",
    "totalOccurrences",
    "createdTimestamp",
    "statusUpdatedTimestamp",
  ],
  filter: ["locationSource", "status", "scientificName", "commonName"],
};

const SEARCH_RECORD_STRING_FILTER_LABELS: Record<
  SearchRecordStringFilterField,
  string
> = {
  locationSource: "Location source",
  status: "Search status",
};

const SEARCH_RECORD_BOOLEAN_FILTER_LABELS: Record<
  SearchRecordBooleanFilterField,
  string
> = {
  scientificName: "Specifies scientific name",
  commonName: "Specifies common name",
};

export const SEARCH_RECORD_QUERY_LABELS: Record<
  SearchRecordQueryInput["field"],
  string
> = {
  locationName: "Location name",
  totalOccurrences: "Total occurrences",
  createdTimestamp: "Search created",
  statusUpdatedTimestamp: "Search last ran",
  ...SEARCH_RECORD_STRING_FILTER_LABELS,
  ...SEARCH_RECORD_BOOLEAN_FILTER_LABELS,
};

type FilterQueryVars = {
  booleanFilter?: SearchRecordBooleanFilterInput[];
  stringFilter?: SearchRecordStringFilterInput[];
};

export const getFilterParamKey = (
  field: SearchRecordStringFilterField | SearchRecordBooleanFilterField,
): keyof FilterQueryVars =>
  field in SEARCH_RECORD_STRING_FILTER_LABELS
    ? "stringFilter"
    : "booleanFilter";

export const parseFilterParams = (filter?: SearchRecordFilterInput[]) =>
  filter?.reduce<{
    booleanFilter?: SearchRecordFilterInput[];
    stringFilter?: SearchRecordFilterInput[];
  }>((prev, cur) => {
    const filterKey = getFilterParamKey(cur.field);
    if (!prev[filterKey]) {
      prev[filterKey] = [];
    }
    prev[filterKey].push(cur);

    return prev;
  }, {}) as FilterQueryVars;

export const ORDERED_BOOLEAN_FILTER_OPTIONS = [
  "Show all",
  "Yes",
  "No",
] as const;

export type BooleanFilterOption =
  (typeof ORDERED_BOOLEAN_FILTER_OPTIONS)[number];

export const BOOLEAN_FILTER_DICT: Record<
  BooleanFilterOption,
  boolean | undefined
> = {
  Yes: true,
  No: false,
  "Show all": undefined,
};
