import { centroid } from "@turf/turf";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { LocationWithPolygon } from "util/schemaTypesUtil";
import LocationPolygon from "./LocationPolygon";
import PolygonDrawing, { SetCustomPolygonFn } from "./PolygonDrawing";

export type LocationDrawingsProps = {
  isCustomizeable?: boolean;
  locationArea?: LocationWithPolygon | null;
};

const LocationDrawings = ({
  isCustomizeable,
  locationArea,
}: LocationDrawingsProps) => {
  const { setSearchLocation } = usePlantSearchContext();

  const setCustomPolygon: SetCustomPolygonFn = (boundingPolygon) => {
    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);
    setSearchLocation({
      displayName: `${lat}, ${lng}`,
      locationSource: "map",
      boundingPolygon,
    });
  };

  return (
    <>
      {locationArea && (
        <LocationPolygon
          {...{ isCustomizeable, setCustomPolygon }}
          {...locationArea}
        />
      )}

      {isCustomizeable && (
        <PolygonDrawing setCustomPolygon={setCustomPolygon} />
      )}
    </>
  );
};

export default LocationDrawings;
