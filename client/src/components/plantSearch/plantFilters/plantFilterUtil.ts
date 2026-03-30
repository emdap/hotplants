import {
  FilterDict,
  FilterInputConfig,
  NON_SPECIFIED_OPTION,
} from "components/dataControls/filterUtil";
import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import { capitalize, sortBy } from "lodash";
import { Entries } from "type-fest";
import { PlantArrayValues, PlantDataFilter } from "util/customSchemaTypes";

export type PlantFilterKey = keyof PlantDataFilter;

export const DYNAMIC_FILTER_DICT: Required<FilterDict<keyof PlantArrayValues>> =
  {
    bloomColors: {
      dataKey: "bloomColors",
      label: "Bloom colors",
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

export const STATIC_FILTER_DICT: FilterDict = {
  scientificName: {
    dataKey: "scientificName",
    label: "Scientific name contains",
    inputType: "text",
    order: -3,
  },
  commonName: {
    dataKey: "commonName",
    label: "Common name contains",
    inputType: "text",
    order: -2,
  },
  isPerennial: {
    dataKey: "isPerennial",
    label: "Perennial",
    inputType: "select-boolean",
    order: 0,
    options: [
      { label: "Perennials only", value: true },
      { label: "Annuals only", value: false },
      { label: "Show all", value: null },
    ],
    asFieldset: true,
  },
  physicalCharactersticsDump: {
    dataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
    order: -1,
  },

  // TODO: BE to support selecting unit
  height: {
    dataKey: "height",
    label: "Plant height",
    inputType: "range",
    minValue: 0,
    order: 2,
  },
  spread: {
    dataKey: "spread",
    label: "Plant spread",
    inputType: "range",
    minValue: 0,
    order: 3,
  },
};

export const constructDynamicFilters = (filterValues: PlantArrayValues) =>
  (Object.entries(filterValues) as Entries<PlantArrayValues>).reduce<
    FilterDict<PlantFilterKey>
  >((prev, [key, values]) => {
    if (values && key in DYNAMIC_FILTER_DICT) {
      const options = sortBy([...values]).map((value): ComplexListboxOption => {
        if (typeof value === "string") {
          return { label: capitalize(value), value };
        }
        return { label: String(value), value };
      });

      options.push(NON_SPECIFIED_OPTION);

      (prev[key] as FilterInputConfig) = {
        ...DYNAMIC_FILTER_DICT[key],
        options,
        order: 1,
      };
    }

    return prev;
  }, {});
