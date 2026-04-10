import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import { PlantSizeRangeInput, PlantSizeUnit } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import { Entries } from "type-fest";
import { FilterValue, PrimitiveValue } from "util/graphqlTypes";

type SelectValueType = "string" | "color" | "boolean" | "number";
export type SelectInputType = `select-${SelectValueType}`;

export type FilterInputType = SelectInputType | "text" | "range" | "checkbox";

type FilterBase<
  T extends FilterInputType = FilterInputType,
  K extends string = string,
> = {
  dataKey: K;
  label: string;
  inputType: T;
  order?: number;
};

export type FilterInputConfig<
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
  [key in T]?: FilterInputConfig<FilterInputType, key>;
};

export type FilterInputComponentProps<
  T extends FilterInputType = FilterInputType,
  V extends FilterValue = FilterValue,
> = {
  filterInput: FilterInputConfig<T>;
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

export const getOrderedFilterEntries = <
  T extends { [key: string]: { label: string; order?: number } },
>(
  filterDict: T,
) =>
  (Object.entries(filterDict) as Entries<T>).sort(([_a, dataA], [_b, dataB]) =>
    dataA.order === undefined
      ? 1
      : dataB.order === undefined
        ? -1
        : dataA.order - dataB.order,
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

const validateSelectFilterValue = (
  inputType: SelectInputType,
  value: FilterValue | unknown,
): boolean => {
  if (value === null) {
    // Null value inside list is acceptable
    return true;
  }

  if (value && typeof value === "object" && "value" in value) {
    if (
      "matchAll" in value &&
      value.matchAll !== undefined &&
      typeof value.matchAll !== "boolean"
    ) {
      return false;
    } else if (Array.isArray(value.value)) {
      return validateFilterValue(inputType, value.value);
    }
    return false;
  } else if (!Array.isArray(value)) {
    if (inputType === "select-boolean") {
      return typeof value === "boolean";
    } else if (["select-color", "select-string"].includes(inputType)) {
      return typeof value === "string";
    } else if (inputType === "select-number") {
      const numberValue = Number(value);
      return !isNaN(numberValue);
    }
    return false;
  } else if (Array.isArray(value)) {
    return value.every((val) => validateFilterValue(inputType, val));
  }

  return false;
};

export const validateFilterValue = (
  inputType: FilterInputType,
  value: FilterValue | unknown,
) => {
  if (inputType === "checkbox") {
    return typeof value === "boolean";
  } else if (inputType === "text") {
    return typeof value === "string";
  } else if (inputType.includes("select")) {
    return validateSelectFilterValue(inputType as SelectInputType, value);
  } else if (inputType === "range" && value && typeof value === "object") {
    const amount =
      "minAmount" in value
        ? value.minAmount
        : "maxAmount" in value
          ? value.maxAmount
          : null;
    return (
      "unit" in value &&
      (PLANT_SIZE_UNITS as unknown[]).includes(value.unit) &&
      amount !== null
    );
  }

  return false;
};
