import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import { PlantSizeRangeInput, PlantSizeUnit } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import { Entries } from "type-fest";
import { FilterValue, PrimitiveValue } from "util/customSchemaTypes";

type SelectValueType = "string" | "color" | "boolean" | "number";
export type SelectInputType = `select-${SelectValueType}`;

export type FilterInputType = SelectInputType | "text" | "range";

type FilterBase<
  T extends FilterInputType = FilterInputType,
  K extends string = string,
> = {
  dataKey: K;
  label: string;
  inputType: T;
  order?: number;
};

export type FilterInput<
  T extends FilterInputType = FilterInputType,
  K extends string = string,
> = FilterBase<T, K> &
  (T extends SelectInputType
    ? FilterSelectInput<T>
    : T extends "range" | "number"
      ? FilterNumberInput
      : { inputType: T });

export type FilterSelectInput<S extends SelectInputType = SelectInputType> = {
  multiselect?: boolean;
  matchAllCheckbox?: boolean;
  asFieldset?: boolean;
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

export type FilterDict<T extends string = string> = {
  [key in T]?: FilterInput<FilterInputType, key>;
};

export type FilterInputComponentProps<
  T extends FilterInputType = FilterInputType,
  V extends FilterValue = FilterValue,
> = {
  filterInput: FilterInput<T>;
  value?: V;
  className?: string;
  onChange: (value?: V) => void;
};

export const NON_SPECIFIED_OPTION: ComplexListboxOption = {
  label: "None specified",
  value: null,
};

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

export const getOrderedFilterEntries = <T extends FilterDict>(filterDict: T) =>
  (Object.entries(filterDict) as Entries<typeof filterDict>).sort(
    ([_a, dataA], [_b, dataB]) => (dataA?.order ?? 0) - (dataB?.order ?? 0),
  );

export const createComplexFilterValue = (
  filterValue?: Exclude<FilterValue, PlantSizeRangeInput>,
) => {
  if (
    filterValue &&
    typeof filterValue === "object" &&
    "value" in filterValue
  ) {
    return filterValue;
  }
  return {
    matchAll: undefined,
    value: filterValue as PrimitiveValue | PrimitiveValue[] | undefined,
  };
};

const PLANT_SIZE_UNITS: PlantSizeUnit[] = [
  "centimeters",
  "meters",
  "inches",
  "feet",
];

export const PLANT_UNIT_OPTIONS = PLANT_SIZE_UNITS.map((unit) => ({
  label: capitalize(unit),
  value: unit,
}));

export const PLANT_UNIT_SHORT_LABELS: Record<PlantSizeUnit, string> = {
  centimeters: "cm",
  meters: "m",
  inches: "in",
  feet: "ft",
};

export const VALUE_PREFIXES = ["min", "max"] as const;
export type ValuePrefix = (typeof VALUE_PREFIXES)[number];
export type ValueNumberKey = keyof Pick<
  PlantSizeRangeInput,
  `${ValuePrefix}Amount`
>;
