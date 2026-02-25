import { ComplexListboxOption } from "designSystem/listbox/StyledListboxOptions";
import { PlantDataKey } from "util/customSchemaTypes";

type SelectValueType = "string" | "color" | "boolean";
export type SelectInput = `select-${SelectValueType}`;

export type FilterInputType =
  | SelectInput
  | "text"
  | "number"
  | "checkbox"
  | "range";

type FilterBase<K extends PlantDataKey, T extends FilterInputType> = {
  plantDataKey: K;
  label: string;
  inputType: T;
};

export type FilterInput<
  K extends PlantDataKey = PlantDataKey,
  T extends FilterInputType = FilterInputType,
> = FilterBase<K, T> &
  (T extends SelectInput
    ? FilterSelectInput<T>
    : T extends "range" | "number"
      ? FilterNumberInput
      : { inputType: T });

type FilterSelectInput<S extends SelectInput = "select-string"> = {
  multiselect?: boolean;
} & (S extends "select-string"
  ? {
      options?: string[];
      freeform?: boolean;
    }
  : { options: ComplexListboxOption[]; freeform?: false });

type FilterNumberInput = {
  minValue?: number;
  maxValue?: number;
};

export const FILTER_DICT: {
  [key in PlantDataKey]?: FilterInput<key, FilterInputType>;
} = {
  scientificName: {
    plantDataKey: "scientificName",
    label: "Scientific name contains",
    inputType: "text",
  },
  commonName: {
    plantDataKey: "commonName",
    label: "Common name contains",
    inputType: "text",
  },
  bloomColors: {
    plantDataKey: "bloomColors",
    label: "Bloom colors",
    inputType: "select-color",
    multiselect: true,
    options: [
      { label: "Red", value: "red" },
      { label: "Orange", value: "orange" },
      { label: "Yellow", value: "yellow" },
      { label: "Green", value: "green" },
      { label: "Blue", value: "blue" },
      { label: "Purple", value: "purple" },
      { label: "White", value: "white" },
    ],
  },
  isPerennial: {
    plantDataKey: "isPerennial",
    label: "Perennial",
    inputType: "select-boolean",
    options: [
      { label: "Perennials only", value: true },
      { label: "Annuals only", value: false },
      { label: "Show all", value: false },
    ],
  },
  physicalCharactersticsDump: {
    plantDataKey: "physicalCharactersticsDump",
    label: "Description keyword search",
    inputType: "text",
  },

  // TODO: Better filters for these on BE -- min/max, select unit?
  height: {
    plantDataKey: "height",
    label: "Plant height (cm)",
    inputType: "number",
  },
  spread: {
    plantDataKey: "spread",
    label: "Plant spread (cm)",
    inputType: "number",
  },
  bloomTimes: {
    plantDataKey: "bloomTimes",
    label: "Bloom time",
    inputType: "select-string",
    multiselect: true,
    freeform: true,
  },
  lightLevels: {
    plantDataKey: "lightLevels",
    label: "Light level",
    inputType: "select-string",
    multiselect: true,
    freeform: true,
  },
  habitat: {
    plantDataKey: "habitat",
    label: "Habitat",
    inputType: "select-string",
    multiselect: true,
    freeform: true,
  },
  hardiness: {
    plantDataKey: "hardiness",
    label: "Hardiness Zones",
    inputType: "range",
    minValue: 0,
    maxValue: 9,
  },
  soilTypes: {
    plantDataKey: "soilTypes",
    label: "Soil type",
    inputType: "select-string",
    multiselect: true,
    freeform: true,
  },
};
