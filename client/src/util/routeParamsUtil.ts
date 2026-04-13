import { polygon } from "@turf/turf";
import { validatePlantFilters } from "components/plantDataControls/plantFilters/plantFilterUtil";
import {
  PlantLocationParams,
  PlantNameParam,
  PlantSearchParams,
} from "config/hotplantsConfig";
import {
  LocationSource,
  SearchRecordBooleanFilterField,
  SearchRecordSortInput,
  SearchRecordStringFilterField,
} from "generated/graphql/graphql";
import { FilterValue, PlantDataFilter } from "./graphqlTypes";

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

export const DEFAULT_PLANT_SEARCH_ROUTE_PARAMS = {
  page: undefined,
  pageSize: undefined,
  location: undefined,
  entityName: undefined,
  plantFilter: undefined,
  lastOpened: undefined,
};

export type PlantSearchRouteParams = PaginationParams &
  (
    | {
        page?: number;
        pageSize?: number;

        location?: PlantLocationParams;
        entityName?: PlantNameParam;
        plantFilter?: PlantDataFilter;
        lastOpened?: string;
      }
    | Partial<typeof DEFAULT_PLANT_SEARCH_ROUTE_PARAMS>
  );

const validateLocation = (
  searchParams: Record<string, unknown>,
): PlantSearchParams | null => {
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
): PlantSearchParams | null => {
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

const validatePlantFilterParam = (
  params: Record<string, unknown>,
): { plantFilter?: PlantDataFilter } => {
  if ("plantFilter" in params && typeof params.plantFilter === "object") {
    const validatedFilters = validatePlantFilters(
      params.plantFilter as PlantDataFilter,
    );
    return { plantFilter: validatedFilters };
  }
  return { plantFilter: undefined };
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
  ...validatePlantFilterParam(params),
  ...validateLocation(params),
  ...validatePlantName(params),
});

export type SearchRecordFilter = {
  [key in SearchRecordStringFilterField]?: FilterValue;
} & { [key in SearchRecordBooleanFilterField]?: boolean };

export type SearchHistoryParams = PaginationParams & {
  filter?: SearchRecordFilter;
  sort?: SearchRecordSortInput[];
  lastOpened?: string;
};

export const DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS: SearchHistoryParams = {
  filter: {},
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

type GardenParams = Pick<PlantSearchRouteParams, "plantFilter"> &
  PaginationParams;
export const validateGardenParams = (
  params: Record<string, unknown>,
): GardenParams => ({
  ...validatePaginationParams(params),
  ...validatePlantFilterParam(params),
});
