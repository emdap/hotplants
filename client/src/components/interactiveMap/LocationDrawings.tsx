import { centroid } from "@turf/turf";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import LocationPolygon from "./LocationPolygon";
import PolygonDrawing, { SetCustomPolygonFn } from "./PolygonDrawing";

const LocationDrawings = ({
  locationCustomizeable,
}: {
  locationCustomizeable?: boolean;
}) => {
  const { location, updateSearchParamsDraft } = useSearchParamsContext();

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
      {location && (
        <LocationPolygon
          {...{ locationCustomizeable, setCustomPolygon }}
          {...location}
        />
      )}

      {locationCustomizeable && (
        <PolygonDrawing setCustomPolygon={setCustomPolygon} />
      )}
    </>
  );
};

export default LocationDrawings;
