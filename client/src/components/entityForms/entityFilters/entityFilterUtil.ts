import {
  BOOLEAN_OPTIONS,
  FilterDict,
  FilterInputConfig,
  NON_SPECIFIED_OPTION,
  SHOW_ALL_OPTION,
  validateFilterValue,
} from "components/dataControls/filterUtil";
import { PlantArrayValues } from "config/hotplantsConfig";
import { ComplexListboxOption } from "designSystem/listbox/listboxUtil";
import { EntityType } from "generated/graphql/graphql";
import { capitalize, sortBy } from "lodash";
import { Entries } from "type-fest";
import { PlantDataFilter } from "util/graphqlTypes";
import { PlantSearchRouteParams } from "util/routeParamsUtil";

export const PLANT_DYNAMIC_FILTER_DICT: Required<
  FilterDict<keyof PlantArrayValues>
> = {
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

export const ENTITY_NAME_FILTER_DICT: FilterDict<
  "commonNameIncludes" | "scientificNameIncludes"
> = {
  scientificNameIncludes: {
    dataKey: "scientificNameIncludes",
    label: "Scientific name contains",
    inputType: "text",
    order: 1,
  },
  commonNameIncludes: {
    dataKey: "commonNameIncludes",
    label: "Common name contains",
    inputType: "text",
    order: 2,
  },
};

export const PLANT_STATIC_FILTER_DICT: FilterDict<
  Exclude<PlantFilterKey, keyof PlantArrayValues>
> = {
  hasScrapedData: {
    dataKey: "hasScrapedData",
    label: "Has scraped data",
    inputType: "select-boolean",
    options: BOOLEAN_OPTIONS,
    asFieldset: true,
    order: 3.5,
  },
  ...ENTITY_NAME_FILTER_DICT,
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
      SHOW_ALL_OPTION,
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

export const COMPLETE_PLANT_FILTER_DICT = {
  ...PLANT_DYNAMIC_FILTER_DICT,
  ...PLANT_STATIC_FILTER_DICT,
};

export const validateEntityFilters = (
  rawFilters: Record<string, unknown>,
  entityType: EntityType,
) => {
  const compareDict =
    entityType === "plant"
      ? COMPLETE_PLANT_FILTER_DICT
      : ENTITY_NAME_FILTER_DICT;
  const validatedFilters = Object.entries(rawFilters).reduce<PlantDataFilter>(
    (prev, [key, value]) => {
      if (key in compareDict) {
        const typesafeKey = key as keyof typeof compareDict;
        const filterConfig = compareDict[typesafeKey];

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
      if (values && key in PLANT_DYNAMIC_FILTER_DICT) {
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
          ...PLANT_DYNAMIC_FILTER_DICT[key],
          options,
        };
      }

      return prev;
    },
    {} as FilterDict<PlantFilterKey>,
  );

export const PLANTS_WITH_DATA_FILTER: PlantSearchRouteParams = {
  filter: { hasScrapedData: true },
};
