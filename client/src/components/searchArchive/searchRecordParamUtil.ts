import {
  BOOLEAN_OPTIONS,
  FilterDict,
  FilterInput,
  getOrderedFilterEntries,
} from "components/dataControls/filterUtil";
import {
  QueryAllSearchRecordsArgs,
  SearchRecord,
  SearchRecordBooleanFilterField,
  SearchRecordBooleanFilterInput,
  SearchRecordSortField,
  SearchRecordStringFilterField,
  SearchRecordStringFilterInput,
} from "generated/graphql/graphql";
import { Entries } from "type-fest";
import { SearchRecordFilterInput } from "util/customSchemaTypes";
import { SearchRecordFilter } from "util/routeParamsUtil";

export type SearchArchiveParamType = "sort" | "filter";

export const SEARCH_RECORD_SORT_LIST: {
  field: SearchRecordSortField;
  label: string;
}[] = [
  { field: "locationName", label: "Location name" },
  { field: "totalOccurrences", label: "Total occurrences" },
  { field: "createdTimestamp", label: "Search created" },
  { field: "lastRanTimestamp", label: "Search last ran" },
];

type FilterQueryVars = {
  booleanFilter?: SearchRecordBooleanFilterInput[];
  stringFilter?: SearchRecordStringFilterInput[];
};

export const getFilterParamKey = (
  field: SearchRecordStringFilterField | SearchRecordBooleanFilterField,
): keyof FilterQueryVars =>
  ["locationSource", "status"].includes(field)
    ? "stringFilter"
    : "booleanFilter";

const SEARCH_RECORD_FILTER_DICT: FilterDict<keyof SearchRecord> = {
  locationSource: {
    dataKey: "locationSource",
    label: "Location source",
    inputType: "select-string",
    multiselect: true,
    options: [
      { label: "Map search", value: "search" },
      { label: "Custom input", value: "custom" },
    ],
    order: 1,
  },
  status: {
    dataKey: "status",
    label: "Search status",
    inputType: "select-string",
    multiselect: true,
    options: [
      { label: "Ready", value: "READY" },
      { label: "Scraping", value: "SCRAPING" },
      { label: "Complete", value: "COMPLETE" },
    ],
    order: 2,
  },
  commonName: {
    dataKey: "commonName",
    label: "Specifies common name",
    inputType: "select-boolean",
    options: BOOLEAN_OPTIONS,
    order: 3,
  },
  scientificName: {
    dataKey: "scientificName",
    label: "Specifies scientific name",
    inputType: "select-boolean",
    options: BOOLEAN_OPTIONS,
    order: 4,
  },
};

export const ORDERED_SEARCH_RECORD_FILTERS = getOrderedFilterEntries(
  SEARCH_RECORD_FILTER_DICT,
);

const getFilterParamType = ({
  inputType,
}: FilterInput): Exclude<
  keyof QueryAllSearchRecordsArgs,
  "sort" | "limit" | "offset"
> | null => {
  switch (inputType) {
    case "select-boolean":
      return "booleanFilter";
    case "select-string":
      return "stringFilter";
    default:
      return null;
  }
};

export type SearchRecordFilterArgs = {
  booleanFilter?: SearchRecordFilterInput[];
  stringFilter?: SearchRecordFilterInput[];
};

export const parseFilterParams = (filter: SearchRecordFilter) =>
  (
    Object.entries(filter) as Entries<SearchRecordFilter>
  )?.reduce<SearchRecordFilterArgs>((prev, [dataKey, filterValue]) => {
    const filterConfig = SEARCH_RECORD_FILTER_DICT[dataKey];
    const filterParamType = filterConfig && getFilterParamType(filterConfig);

    if (!filterParamType || !filterValue) {
      return prev;
    }

    if (!prev[filterParamType]) {
      prev[filterParamType] = [];
    }

    prev[filterParamType].push({ field: dataKey, value: filterValue });

    return prev;
  }, {}) as FilterQueryVars;
