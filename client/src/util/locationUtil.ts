import { bboxPolygon, coordAll, simplify } from "@turf/turf";
import { PlantLocationParams } from "config/hotplantsConfig";
import type * as Nominatim from "generated/schemas/nominatim";
import type { paths } from "generated/schemas/nominatim";
import {
  BBox,
  Feature,
  Polygon,
  Polygon as PolygonType,
  Position,
} from "geojson";
import createClient from "openapi-fetch";
import { toast } from "sonner";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

type LocationData = Nominatim.components["schemas"]["OSMGeocodeJson"][number];
export type LocationCoord = [number, number];

const DEFAULT_QUERY_PARAMS = {
  format: "json" as const,
  polygon_geojson: 1,
  polygon_threshold: 0.5,
};

export const reverseLookupLocation = async (coords: GeolocationCoordinates) => {
  try {
    const { data, error } = await locationClient.GET("/reverse", {
      params: {
        query: {
          lat: coords.latitude,
          lon: coords.longitude,
          zoom: 5,
          ...DEFAULT_QUERY_PARAMS,
        },
      },
    });

    if (error) {
      throw error;
    }

    const location = Array.isArray(data) ? data[0] : (data ?? {});
    const validatedLocation = validateNominatimLocation(location);

    if (!validatedLocation) {
      throw { message: "Unable to use current location." };
    }

    return validatedLocation;
  } catch (error) {
    toast.error(
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : `Unknown error occurred: ${String(error)}`,
    );
  }
};

export const lookupLocationInput = (input: string) =>
  locationClient.GET("/search", {
    params: {
      query: {
        q: input,
        ...DEFAULT_QUERY_PARAMS,
      },
    },
  });

export const MAX_POLYGON_POINTS = 20;
const MAX_SIMPLIFY_TRIES = 5;

const simplifyPolygon = (polygon: Polygon, attempt = 0) => {
  if (attempt >= MAX_SIMPLIFY_TRIES) {
    return null;
  }

  const coords = coordAll(polygon);

  if (coords.length > MAX_POLYGON_POINTS) {
    const simplified = simplify(polygon, {
      tolerance: 0.01,
      highQuality: true,
    });

    return simplifyPolygon(simplified, attempt + 1);
  } else {
    return polygon;
  }
};

const convertNominatimGeojson = (location: LocationData) => {
  if (!location?.display_name || !location?.boundingbox || !location?.geojson) {
    return null;
  }

  if (location.geojson.type === "Polygon") {
    const simplified = simplifyPolygon(location.geojson);
    if (simplified) {
      return simplified.coordinates;
    }
  }

  const bboxNumbers = location.boundingbox.map(Number);
  const boundingBox: BBox = [
    bboxNumbers[2],
    bboxNumbers[0],
    bboxNumbers[3],
    bboxNumbers[1],
  ];

  return bboxPolygon(boundingBox).geometry.coordinates;
};

export const validateNominatimLocation = (
  location?: LocationData,
): null | PlantLocationParams => {
  if (!location?.display_name) {
    return null;
  }

  const boundingPolyCoords = convertNominatimGeojson(location);

  return (
    boundingPolyCoords && {
      locationName: location.display_name,
      locationSource: "search",
      boundingPolyCoords,
    }
  );
};

export const locationDisplay = (
  location: Omit<PlantLocationParams, "boundingPolyCoords">,
  shortenCustom?: boolean,
) => {
  if (location.locationSource === "custom") {
    return {
      title: shortenCustom ? "Custom" : customLocationDisplay(location),
    };
  }

  const splitName = location.locationName.split(", ");
  return {
    title: splitName[0],
    subTitle: splitName.slice(1).join(", "),
  };
};

export const customLocationDisplay = (
  location: Omit<PlantLocationParams, "boundingPolyCoords">,
) => `Custom Location: (${location.locationName ?? "N/A"})`;

export const crossesMeridian = (coordinates: Position[]) => {
  const hasCoords: Record<string, boolean> = {
    ["180"]: false,
    ["-180"]: false,
  };
  return coordinates.some(([lng]) => {
    const lngKey = String(lng);
    if (lngKey in hasCoords) {
      hasCoords[lngKey] = true;
      if (hasCoords["180"] && hasCoords["-180"]) {
        return true;
      }
    }
  });
};

// GeoJSON spec dictates lng, lat
// Leaflet uses lat, lng
export const swapLatLng = (
  coords: number[][] | LocationCoord[],
): LocationCoord[] => coords.map(([first, second]) => [second, first]);

export const getOuterCoordinates = (feature: Feature<PolygonType>) =>
  feature.geometry.coordinates[0];

export const validateLocationParams = ({
  locationName,
  locationSource,
  boundingPolyCoords,
}: {
  [key in keyof PlantLocationParams]?:
    | PlantLocationParams[key]
    | null
    | undefined;
}): PlantLocationParams | undefined => {
  if (locationName && locationSource && boundingPolyCoords) {
    return { locationName, locationSource, boundingPolyCoords };
  }
};
