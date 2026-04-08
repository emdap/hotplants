import {
  FilterDict,
  FilterInputConfig,
  NON_SPECIFIED_OPTION,
  validateFilterValue,
} from "components/dataControls/filterUtil";
import { PlantArrayValues } from "config/hotplantsConfig";
import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import { capitalize, sortBy } from "lodash";
import { Entries } from "type-fest";
import { PlantDataFilter } from "util/graphqlTypes";

export const DYNAMIC_FILTER_DICT: Required<FilterDict<keyof PlantArrayValues>> =
  {
    bloomColors: {
      dataKey: "bloomColors",
      label: "Bloom color",
      inputType: "select-color",
      multiselect: true,
      matchAllCheckbox: true,
      asFieldset: true,
    },
    bloomTimes: {
      dataKey: "bloomTimes",
      label: "Bloom time",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
      asFieldset: true,
    },
    lightLevels: {
      dataKey: "lightLevels",
      label: "Light level",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
      asFieldset: true,
    },
    // habitats: {
    //   dataKey: "habitats",
    //   label: "Habitat",
    //   inputType: "select-string",
    //   multiselect: true,
    //   matchAllCheckbox: true,
    // },
    hardiness: {
      dataKey: "hardiness",
      label: "USDA Hardiness Zone",
      inputType: "select-number",
      multiselect: true,
      matchAllCheckbox: true,
      asFieldset: true,
    },
    soilTypes: {
      dataKey: "soilTypes",
      label: "Soil type",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
      asFieldset: true,
    },
  };

type PlantFilterKey = keyof Omit<
  PlantDataFilter,
  | "addedTimestamp"
  | "updatedTimestamp"
  | "maturityTime"
  | "scrapeSources"
  | "uses"
  | "habitats"
>;

export const STATIC_FILTER_DICT: FilterDict<
  Exclude<PlantFilterKey, keyof PlantArrayValues>
> = {
  scientificName: {
    dataKey: "scientificName",
    label: "Scientific name contains",
    inputType: "text",
    order: 1,
  },
  commonName: {
    dataKey: "commonName",
    label: "Common name contains",
    inputType: "text",
    order: 2,
  },
  physicalCharactersticsDump: {
    dataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
    order: 3,
  },
  isPerennial: {
    dataKey: "isPerennial",
    label: "Perennial",
    inputType: "select-boolean",
    order: 4,
    options: [
      { label: "Perennials only", value: true },
      { label: "Annuals only", value: false },
      { label: "Show all", value: null },
    ],
    asFieldset: true,
  },

  // TODO: BE to support selecting unit
  height: {
    dataKey: "height",
    label: "Plant height",
    inputType: "range",
    minValue: 0,
  },
  spread: {
    dataKey: "spread",
    label: "Plant spread",
    inputType: "range",
    minValue: 0,
  },
};

export const COMPLETE_FILTER_DICT = {
  ...DYNAMIC_FILTER_DICT,
  ...STATIC_FILTER_DICT,
};

export const validatePlantFilters = (rawFilters: Record<string, unknown>) => {
  const validatedFilters = Object.entries(rawFilters).reduce<PlantDataFilter>(
    (prev, [key, value]) => {
      if (key in COMPLETE_FILTER_DICT) {
        const typesafeKey = key as PlantFilterKey;
        const filterConfig = COMPLETE_FILTER_DICT[typesafeKey];

        if (
          filterConfig &&
          validateFilterValue(filterConfig.inputType, value)
        ) {
          return { ...prev, [typesafeKey]: value };
        }
      }

      return prev;
    },
    {},
  );

  return Object.keys(validatedFilters).length ? validatedFilters : undefined;
};

export const constructDynamicFilters = (filterValues: PlantArrayValues) =>
  (Object.entries(filterValues) as Entries<PlantArrayValues>).reduce(
    (prev, [key, values]) => {
      if (values && key in DYNAMIC_FILTER_DICT) {
        const options = sortBy([...values]).map(
          (value): ComplexListboxOption => {
            if (typeof value === "string") {
              return { label: capitalize(value), value };
            }
            return { label: String(value), value };
          },
        );

        options.push(NON_SPECIFIED_OPTION);

        (prev[key] as FilterInputConfig) = {
          ...DYNAMIC_FILTER_DICT[key],
          options,
        };
      }

      return prev;
    },
    {} as FilterDict<PlantFilterKey>,
  );
