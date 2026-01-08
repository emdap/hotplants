import { polygon } from "@turf/turf";
import { LocationSource } from "generated/graphql/graphql";
import { PlantSearchFilters, PlantSearchParams } from "./customSchemaTypes";

const validateString = (input: unknown) => String(input || "") || undefined;

export const DEFAULT_PLANT_SEARCH_PARAMS = { search: null, filters: {} };

type PlantSearchRouteParams =
  | {
      search: PlantSearchParams;
      filters: PlantSearchFilters;
      page?: number;
    }
  | Partial<typeof DEFAULT_PLANT_SEARCH_PARAMS>;

const validateSearch = (searchParams: unknown): PlantSearchParams | null => {
  if (typeof searchParams === "object" && searchParams !== null) {
    const typesafeParams = searchParams as Record<string, unknown>;

    if (!typesafeParams?.boundingPolyCoords) {
      return null;
    }

    let boundingPolyCoords: number[][][] | undefined;

    try {
      boundingPolyCoords = polygon(
        typesafeParams.boundingPolyCoords as number[][][]
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
      ...searchParams,
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

export const validatePlantSearchParams = (
  params: Record<string, unknown>
): PlantSearchRouteParams => {
  const search = validateSearch(params.search);

  if (search) {
    const filters = validateFilters(params.filters);
    return { search, filters };
  }

  return { search, filters: {} };
};
