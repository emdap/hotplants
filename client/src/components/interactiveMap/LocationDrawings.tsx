import { centroid } from "@turf/turf";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import LocationPolygon from "./LocationPolygon";
import PolygonDrawing, { SetCustomPolygonFn } from "./PolygonDrawing";

const LocationDrawings = ({
  locationCustomizeable,
}: {
  locationCustomizeable?: boolean;
}) => {
  const { searchParams, updateSearchParamsDraft } = usePlantSearchContext();

  const setCustomPolygon: SetCustomPolygonFn = (boundingPolygon) => {
    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);

    updateSearchParamsDraft({
      location: {
        locationName: `${lat}, ${lng}`,
        locationSource: "custom",
        boundingPolyCoords: boundingPolygon.geometry.coordinates,
      },
    });
  };

  return (
    <>
      {searchParams.location && (
        <LocationPolygon
          {...{ locationCustomizeable, setCustomPolygon }}
          {...searchParams.location}
        />
      )}

      {locationCustomizeable && (
        <PolygonDrawing setCustomPolygon={setCustomPolygon} />
      )}
    </>
  );
};

export default LocationDrawings;
