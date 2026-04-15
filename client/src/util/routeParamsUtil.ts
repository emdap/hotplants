import { polygon } from "@turf/turf";
import { validateEntityFilters } from "components/entityForms/entityFilters/entityFilterUtil";
import {
  EntitySearchParams,
  PlantLocationParams,
  PlantNameParam,
} from "config/hotplantsConfig";
import {
  EntityType,
  LocationSource,
  SearchRecordBooleanFilterField,
  SearchRecordSortInput,
  SearchRecordStringFilterField,
} from "generated/graphql/graphql";
import { AnimalDataFilter, FilterValue, PlantDataFilter } from "./graphqlTypes";

// TODO: Split up this file!

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

const validateString = (input: unknown, subKey?: string) => {
  const inputObject = input && typeof input === "object" ? input : null;

  if (subKey && inputObject) {
    return subKey in inputObject
      ? String(inputObject[subKey as keyof typeof inputObject] || "")
      : undefined;
  }
  return inputObject ? String(inputObject) : undefined;
};

const DEFAULT_ENTITY_SEARCH_PARAMS = {
  location: undefined,
  entityName: undefined,
  lastOpened: undefined,
};

export const DEFAULT_PLANT_SEARCH_ROUTE_PARAMS = {
  entityType: "plant" as const,
  filter: undefined,
  ...DEFAULT_ENTITY_SEARCH_PARAMS,
};

export const DEFAULT_ANIMAL_SEARCH_ROUTE_PARAMS = {
  entityType: "animal" as const,
  filter: undefined,
  ...DEFAULT_ENTITY_SEARCH_PARAMS,
};

type EntityFilter<E = EntityType> = E extends "animal"
  ? AnimalDataFilter
  : PlantDataFilter;

type EntitySearchRouteParams<E = EntityType> = PaginationParams & {
  entityType?: E;
  filter?: EntityFilter<E>;

  page?: number;
  pageSize?: number;

  location?: PlantLocationParams;
  entityName?: PlantNameParam;
  lastOpened?: string;
};

export type PlantSearchRouteParams = EntitySearchRouteParams<"plant">;

export type AnimalSearchRouteParams = EntitySearchRouteParams<"animal">;

const validateLocation = (
  searchParams: Record<string, unknown>,
): Pick<EntitySearchParams, "location"> | null => {
  if (searchParams.location && typeof searchParams.location === "object") {
    const locationParams = searchParams.location;
    if (
      "boundingPolyCoords" in locationParams &&
      "locationName" in locationParams &&
      "locationSource" in locationParams
    ) {
      try {
        const boundingPolyCoords = polygon(
          locationParams.boundingPolyCoords as number[][][],
        ).geometry.coordinates;

        const locationName = validateString(locationParams.locationName);
        const stringSource = validateString(locationParams.locationSource);
        const locationSource =
          stringSource && ["custom", "search"].includes(stringSource)
            ? (stringSource as LocationSource)
            : undefined;

        if (locationName && locationSource) {
          return {
            location: { boundingPolyCoords, locationName, locationSource },
          };
        }
      } catch (e) {
        console.error("Invalid parameters:", e);
      }
    }
  }
  return null;
};

const validatePlantName = (
  searchParams: Record<string, unknown>,
): Pick<EntitySearchParams, "entityName"> | null => {
  if (searchParams.entityName && typeof searchParams.entityName === "object") {
    const commonName = validateString(searchParams.entityName, "commonName");
    if (commonName) {
      return { entityName: { commonName } };
    } else {
      const scientificName = validateString(
        searchParams.entityName,
        "scientificName",
      );
      if (scientificName) {
        return { entityName: { scientificName } };
      }
    }
  }

  return null;
};

const validateEntityFilterParam = <E = EntityType>(
  params: Record<string, unknown>,
  entityType: E & EntityType,
) => {
  let validatedFilters: EntityFilter<E> | undefined;

  if ("filter" in params && typeof params.filter === "object") {
    validatedFilters = validateEntityFilters(
      params.filter as EntityFilter<E>,
      entityType,
    );
  }

  return { filter: validatedFilters };
};

const getNumParamValue = (param?: unknown) => {
  const numParam = Number(param);
  return isNaN(numParam) ? undefined : Math.max(1, numParam);
};

export const validatePaginationParams = (
  params: Record<string, unknown>,
): PaginationParams => {
  const page = getNumParamValue(params.page);
  const pageSize = getNumParamValue(params.pageSize);

  return {
    ...(page && { page }),
    ...(pageSize && { pageSize }),
  };
};

export const validatePlantSearchParams = (
  params: Record<string, unknown>,
): PlantSearchRouteParams => ({
  ...validatePaginationParams(params),
  ...validateEntityFilterParam(params, "plant"),
  ...validateLocation(params),
  ...validatePlantName(params),
  entityType: "plant",
});

export const validateAnimalSearchParams = (
  params: Record<string, unknown>,
): AnimalSearchRouteParams => ({
  ...validatePaginationParams(params),
  ...validateEntityFilterParam(params, "animal"),
  ...validateLocation(params),
  ...validatePlantName(params),
  entityType: "animal",
});

export type SearchRecordFilter = {
  [key in SearchRecordStringFilterField]?: FilterValue;
} & { [key in SearchRecordBooleanFilterField]?: boolean };

export type SearchHistoryParams = PaginationParams & {
  recordFilter?: SearchRecordFilter;
  sort?: SearchRecordSortInput[];
  lastOpened?: string;
};

export const DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS: SearchHistoryParams = {
  recordFilter: {},
  sort: [{ field: "lastRanTimestamp", value: -1 }],
};

// TODO: actually validate the filter types
const validateSearchRecordFilter = (
  params: Record<string, unknown>,
): { filter: SearchRecordFilter } | null => {
  if ("filter" in params && typeof params.filter === "object") {
    return { filter: params.filter as SearchRecordFilter };
  }
  return null;
};

const validateSearchRecordSort = (
  params: Record<string, unknown>,
): { sort?: SearchRecordSortInput[] } | null => ({
  sort:
    params.sort && Array.isArray(params.sort)
      ? (params.sort as SearchRecordSortInput[])
      : DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS.sort,
});

export const validateSearchHistoryParams = (
  params: Record<string, string>,
): SearchHistoryParams => {
  const lastOpened = validateString(params.lastOpened);

  return {
    ...(lastOpened && { lastOpened }),
    ...validateSearchRecordFilter(params),
    ...validateSearchRecordSort(params),
    ...validatePaginationParams(params),
  };
};

type GardenParams = Pick<PlantSearchRouteParams, "filter"> & PaginationParams;
export const validateGardenParams = (
  params: Record<string, unknown>,
): GardenParams => ({
  ...validatePaginationParams(params),
  ...validateEntityFilterParam(params, "plant"),
});
