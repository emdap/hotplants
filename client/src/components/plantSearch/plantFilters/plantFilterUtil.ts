import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import {
  PlantArrayFilterIntInput,
  PlantArrayFilterStringInput,
  PlantDataInput,
} from "generated/graphql/graphql";
import { capitalize, sortBy } from "lodash";
import { Entries } from "type-fest";
import { PlantArrayValues, PlantDataFilter } from "util/customSchemaTypes";

export type PlantFilterKey = keyof PlantDataFilter;

type SelectValueType = "string" | "color" | "boolean" | "number";
export type SelectInputType = `select-${SelectValueType}`;

export type FilterInputType = SelectInputType | "text" | "range";

type FilterBase<
  T extends FilterInputType = FilterInputType,
  K extends PlantFilterKey = PlantFilterKey,
> = {
  plantDataKey: K;
  label: string;
  inputType: T;
  order?: number;
};

export type FilterInput<
  T extends FilterInputType = FilterInputType,
  K extends PlantFilterKey = PlantFilterKey,
> = FilterBase<T, K> &
  (T extends SelectInputType
    ? FilterSelectInput<T>
    : T extends "range" | "number"
      ? FilterNumberInput
      : { inputType: T });

export type FilterSelectInput<S extends SelectInputType = SelectInputType> = {
  multiselect?: boolean;
  matchAllCheckbox?: boolean;
} & (S extends "select-string"
  ? {
      options?: string[];
      freeform?: boolean;
    }
  : { options?: ComplexListboxOption[]; freeform?: false });

type FilterNumberInput = {
  minValue?: number;
  maxValue?: number;
};

export type FilterDict<T extends PlantFilterKey = PlantFilterKey> = {
  [key in T]?: FilterInput<FilterInputType, key>;
};

export const DYNAMIC_FILTER_DICT: Required<FilterDict<keyof PlantArrayValues>> =
  {
    bloomColors: {
      plantDataKey: "bloomColors",
      label: "Bloom colors",
      inputType: "select-color",
      multiselect: true,
      matchAllCheckbox: true,
    },
    bloomTimes: {
      plantDataKey: "bloomTimes",
      label: "Bloom time",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
    },
    lightLevels: {
      plantDataKey: "lightLevels",
      label: "Light level",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
    },
    // habitats: {
    //   plantDataKey: "habitats",
    //   label: "Habitat",
    //   inputType: "select-string",
    //   multiselect: true,
    //   matchAllCheckbox: true,
    // },
    hardiness: {
      plantDataKey: "hardiness",
      label: "USDA Hardiness Zone",
      inputType: "select-number",
      multiselect: true,
      matchAllCheckbox: true,
    },
    soilTypes: {
      plantDataKey: "soilTypes",
      label: "Soil type",
      inputType: "select-string",
      multiselect: true,
      matchAllCheckbox: true,
    },
  };

export const STATIC_FILTER_DICT: FilterDict = {
  scientificName: {
    plantDataKey: "scientificName",
    label: "Scientific name contains",
    inputType: "text",
    order: -3,
  },
  commonName: {
    plantDataKey: "commonName",
    label: "Common name contains",
    inputType: "text",
    order: -2,
  },
  isPerennial: {
    plantDataKey: "isPerennial",
    label: "Perennial",
    inputType: "select-boolean",
    order: 0,
    options: [
      { label: "Perennials only", value: true },
      { label: "Annuals only", value: false },
      { label: "Show all", value: null },
    ],
  },
  physicalCharactersticsDump: {
    plantDataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
    order: -1,
  },

  // TODO: BE to support selecting unit
  height: {
    plantDataKey: "height",
    label: "Plant height",
    inputType: "range",
    minValue: 0,
    order: 2,
  },
  spread: {
    plantDataKey: "spread",
    label: "Plant spread",
    inputType: "range",
    minValue: 0,
    order: 3,
  },
};

export const NON_SPECIFIED_OPTION: ComplexListboxOption = {
  label: "None specified",
  value: null,
};

export const constructDynamicFilters = (filterValues: PlantArrayValues) =>
  (
    Object.entries(filterValues) as Entries<PlantArrayValues>
  ).reduce<FilterDict>((prev, [key, values]) => {
    if (values && key in DYNAMIC_FILTER_DICT) {
      const options = sortBy([...values]).map((value): ComplexListboxOption => {
        if (typeof value === "string") {
          return { label: capitalize(value), value };
        }
        return { label: String(value), value };
      });

      options.push(NON_SPECIFIED_OPTION);

      (prev[key] as FilterInput) = {
        ...DYNAMIC_FILTER_DICT[key],
        options,
        order: 1,
      };
    }

    return prev;
  }, {});

export const getSortedFilterEntries = (filterDict: FilterDict) =>
  (Object.entries(filterDict) as Entries<typeof filterDict>).sort(
    ([_a, dataA], [_b, dataB]) => (dataA?.order ?? 0) - (dataB?.order ?? 0),
  );

export type FilterInputComponentProps<
  T extends FilterInputType = FilterInputType,
  K extends PlantFilterKey = PlantFilterKey,
> = {
  filterInput: FilterInput<T, K>;
  value: PlantDataInput[K];
  onChange: <V = PlantDataInput[K]>(value?: V) => void;
};

export type PlantArrayFilterInput =
  | PlantArrayFilterStringInput
  | PlantArrayFilterIntInput;

export const BOOLEAN_OPTIONS: ComplexListboxOption<boolean | null>[] = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
  {
    label: "Show all",
    value: null,
  },
];
