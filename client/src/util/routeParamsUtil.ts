import { polygon } from "@turf/turf";
import {
  LocationSource,
  SearchRecordBooleanFilterInput,
  SearchRecordSortInput,
  SearchRecordStringFilterInput,
} from "generated/graphql/graphql";
import {
  PlantDataFilter,
  PlantLocationParams,
  PlantNameParam,
  PlantSearchParams,
} from "./customSchemaTypes";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

const validateString = (input: unknown, subKey?: string) =>
  (subKey && input && typeof input === "object" && subKey in input
    ? String(input[subKey as keyof typeof input] || "")
    : String(input || "")) || undefined;

export const DEFAULT_PLANT_SEARCH_ROUTE_PARAMS = {
  page: undefined,
  pageSize: undefined,
  location: undefined,
  plantName: undefined,
  plantFilter: undefined,
  lastOpened: undefined,
};

export type PlantSearchRouteParams = PaginationParams &
  (
    | {
        page?: number;
        pageSize?: number;

        location?: PlantLocationParams;
        plantName?: PlantNameParam;
        plantFilter?: PlantDataFilter;
        lastOpened?: string;
      }
    | Partial<typeof DEFAULT_PLANT_SEARCH_ROUTE_PARAMS>
  );

const validateSearch = (
  searchParams: Record<string, unknown>,
): PlantSearchParams | null => {
  let typesafeParams: PlantSearchParams | null = null;

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
          typesafeParams = {
            location: { boundingPolyCoords, locationName, locationSource },
          };
        }
      } catch (e) {
        console.error("Invalid parameters:", e);
        return null;
      }
    }
  }

  if (searchParams.plantName && typeof searchParams.plantName === "object") {
    const commonName = validateString(searchParams.plantName, "commonName");
    if (commonName) {
      typesafeParams = { ...typesafeParams, plantName: { commonName } };
    } else {
      const scientificName = validateString(
        searchParams.plantName,
        "scientificName",
      );
      if (scientificName) {
        typesafeParams = { ...typesafeParams, plantName: { scientificName } };
      }
    }
  }

  return typesafeParams;
};

// TODO: actually validate the filter types
const validatePlantFilter = (
  params: Record<string, unknown>,
): { plantFilter: PlantDataFilter } | null => {
  if ("filter" in params && typeof params.filter === "object") {
    return { plantFilter: params.filter as PlantDataFilter };
  }
  return null;
};

const getNumParamValue = (param?: unknown) => {
  const numParam = Number(param);
  return isNaN(numParam) ? undefined : Math.max(1, numParam);
};

export const validatePaginationParams = (
  params: Record<string, unknown>,
): PaginationParams => ({
  page: getNumParamValue(params.page),
  pageSize: getNumParamValue(params.pageSize),
});

export const validatePlantSearchParams = (
  params: Record<string, unknown>,
): PlantSearchRouteParams => ({
  ...validatePaginationParams(params),
  ...validatePlantFilter(params),
  ...validateSearch(params),
});

export type SearchRecordFilterInput =
  | SearchRecordStringFilterInput
  | SearchRecordBooleanFilterInput;

type SearchArchiveParams = PaginationParams & {
  filter?: SearchRecordFilterInput[];
  sort?: SearchRecordSortInput[];
  lastOpened?: string;
};

export const validateSearchArchiveParams = (
  params: Record<string, string>,
): SearchArchiveParams => {
  if (typeof params.lastOpened === "string") {
    return { lastOpened: params.lastOpened };
  }
  return {
    lastOpened: validateString(params.lastOpened),
    ...validatePaginationParams(params),
  };
};

type GardenParams = Pick<PlantSearchRouteParams, "plantFilter"> &
  PaginationParams;
export const validateGardenParams = (
  params: Record<string, unknown>,
): GardenParams => ({
  ...validatePaginationParams(params),
  ...validatePlantFilter(params),
});
