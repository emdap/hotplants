import { polygon } from "@turf/turf";
import {
  LocationSource,
  SearchRecordBooleanFilterInput,
  SearchRecordStringFilterInput,
} from "generated/graphql/graphql";
import { PlantSearchFilters, PlantSearchParams } from "./customSchemaTypes";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

const validateString = (input: unknown) => String(input || "") || undefined;

export const DEFAULT_PLANT_SEARCH_ROUTE_PARAMS = {
  page: undefined,
  pageSize: undefined,
  search: undefined,
  filters: undefined,
};

type PlantSearchRouteParams = PaginationParams &
  (
    | {
        page?: number;
        pageSize?: number;

        search: PlantSearchParams | null;
        filters: PlantSearchFilters;
      }
    | Partial<typeof DEFAULT_PLANT_SEARCH_ROUTE_PARAMS>
  );

const STRING_SEARCH_PARAMS: (keyof PlantSearchParams)[] = [
  "commonName",
  "scientificName",
];

const extractStringParams = (
  searchParams: object,
): Partial<PlantSearchParams> =>
  STRING_SEARCH_PARAMS.reduce<Partial<PlantSearchParams>>((prev, cur) => {
    if (cur in searchParams) {
      const typesafeKey = cur as keyof typeof searchParams;
      if (searchParams[typesafeKey]) {
        return { ...prev, [typesafeKey]: searchParams[typesafeKey] };
      }
    }
    return prev;
  }, {});

const validateSearch = (searchParams: unknown): PlantSearchParams | null => {
  if (typeof searchParams === "object" && searchParams !== null) {
    const typesafeParams = searchParams as Record<string, unknown>;

    if (!typesafeParams?.boundingPolyCoords) {
      return null;
    }

    let boundingPolyCoords: number[][][] | undefined;

    try {
      boundingPolyCoords = polygon(
        typesafeParams.boundingPolyCoords as number[][][],
      ).geometry.coordinates;
    } catch (e) {
      console.error("Invalid parameters:", e);
      return null;
    }

    const locationName = validateString(typesafeParams?.locationName);
    if (!locationName) {
      return null;
    }

    const stringSource = validateString(typesafeParams?.locationSource);
    const locationSource =
      stringSource && ["custom", "search"].includes(stringSource)
        ? (stringSource as LocationSource)
        : undefined;

    if (!locationSource) {
      return null;
    }

    return {
      ...extractStringParams(searchParams),
      locationName,
      locationSource,
      boundingPolyCoords,
    };
  }

  return null;
};

// TODO: actually validate the filter types
const validateFilters = (filterParams: unknown): PlantSearchFilters => {
  if (typeof filterParams === "object" && filterParams !== null) {
    return filterParams as PlantSearchFilters;
  }
  return {};
};

const getNumParamValue = (param?: unknown) => {
  const numParam = Number(param);
  return isNaN(numParam) ? undefined : numParam;
};

const getPaginationParams = (
  params: Record<string, unknown>,
): PaginationParams => ({
  page: getNumParamValue(params.page),
  pageSize: getNumParamValue(params.pageSize),
});

export const validatePlantSearchParams = (
  params: Record<string, unknown>,
): PlantSearchRouteParams => {
  const search = validateSearch(params.search);

  if (search) {
    return {
      ...getPaginationParams(params),
      filters: validateFilters(params.filters),
      search,
    };
  }

  return {};
};

type SearchArchiveParams = PaginationParams & {
  stringFilter?: SearchRecordStringFilterInput;
  booleanFilter?: SearchRecordBooleanFilterInput;
  sortField?: string;
  sortDir?: -1 | 1;
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
    ...getPaginationParams(params),
  };
};
