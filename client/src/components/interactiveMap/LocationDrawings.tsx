import { centroid } from "@turf/turf";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LocationPolygon from "./LocationPolygon";
import PolygonDrawing, { SetCustomPolygonFn } from "./PolygonDrawing";

const LocationDrawings = ({
  locationCustomizeable,
}: {
  locationCustomizeable?: boolean;
}) => {
  const { searchLocation, setSearchLocation } = usePlantSearchContext();

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
      {searchLocation && (
        <LocationPolygon
          {...{ locationCustomizeable, setCustomPolygon }}
          {...searchLocation}
        />
      )}

      {locationCustomizeable && (
        <PolygonDrawing setCustomPolygon={setCustomPolygon} />
      )}
    </>
  );
};

export default LocationDrawings;
