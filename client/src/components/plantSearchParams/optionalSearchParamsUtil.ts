import { FilterInput } from "components/plantFilters/plantFilterUtil";
import { OptionalSearchParamKey } from "util/customSchemaTypes";

export const OPTIONAL_SEARCH_PARAM_FILTERS: FilterInput<OptionalSearchParamKey>[] =
  [
    {
      plantDataKey: "commonName",
      label: "Common name",
      inputType: "text",
    },
    {
      plantDataKey: "scientificName",
      label: "Scientific name",
      inputType: "text",
    },
  ];

export const DEFAULT_OPTIONAL_SEARCH_PARAMS = {
  commonName: undefined,
  scientificName: undefined,
};
