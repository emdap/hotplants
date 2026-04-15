import {
  BOOLEAN_OPTIONS,
  FilterDict,
  FilterInputConfig,
  SHOW_ALL_OPTION,
} from "components/dataControls/filterUtil";
import {
  QueryAllSearchRecordsArgs,
  SearchRecordBooleanFilterField,
  SearchRecordBooleanFilterInput,
  SearchRecordSortField,
  SearchRecordStringFilterField,
  SearchRecordStringFilterInput,
} from "generated/graphql/graphql";
import { Entries } from "type-fest";
import { SearchRecordFilterInput } from "util/graphqlTypes";
import { SearchHistoryParams, SearchRecordFilter } from "util/routeParamsUtil";

export type SearchHistoryParamType = "sort" | "filter";

export const SEARCH_RECORD_SORT_LIST: {
  field: SearchRecordSortField;
  label: string;
}[] = [
  { field: "lastRanTimestamp", label: "Search last ran" },
  { field: "createdTimestamp", label: "Search created" },
  { field: "locationName", label: "Location name" },
  { field: "totalOccurrences", label: "Total occurrences" },
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

export const USER_SEARCH_HISTORY_FILTER: FilterInputConfig<
  "checkbox",
  SearchRecordBooleanFilterField
> = {
  dataKey: "userSearch",
  inputType: "checkbox",
  label: "Only my searches",
  order: -1,
};

export const SEARCH_HISTORY_FILTER_DICT: FilterDict<
  SearchRecordBooleanFilterField | SearchRecordStringFilterField
> = {
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
  entityType: {
    dataKey: "entityType",
    label: "Search type",
    inputType: "select-string",
    options: [
      {
        label: "Plant search",
        value: "plant",
      },
      { label: "Animal search (beta)", value: "animal" },
      SHOW_ALL_OPTION,
    ],
    order: 5,
  },
};

const getFilterParamType = ({
  inputType,
}: FilterInputConfig): Exclude<
  keyof QueryAllSearchRecordsArgs,
  "sort" | "limit" | "offset"
> | null => {
  switch (inputType) {
    case "checkbox":
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
    const filterConfig =
      dataKey === "userSearch"
        ? USER_SEARCH_HISTORY_FILTER
        : SEARCH_HISTORY_FILTER_DICT[dataKey];
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

export type SearchHistoryPopoverProps = {
  currentParams?: Pick<SearchHistoryParams, "recordFilter" | "sort">;
  applyParams: (params: SearchHistoryParams) => void;
};

export const POPOVER_LABELS = {
  filter: "Filter",
  sort: "Sort",
};
