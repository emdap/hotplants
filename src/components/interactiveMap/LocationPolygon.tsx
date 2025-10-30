import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { LatLngTuple, LeafletEvent, Marker as MarkerType } from "leaflet";
import { useEffect, useMemo } from "react";
import { Marker, Polygon, Tooltip, useMap } from "react-leaflet";
import { LocationCoord } from "schemaHelpers/customSchemaTypes";
import { LocationWithPolygon } from "schemaHelpers/schemaTypesUtil";

// GeoJSON spec dictates lng, lat
// Leaflet uses lat, lng
const swapLatLng = (coords: number[][] | LocationCoord[]): LocationCoord[] =>
  coords.map(([first, second]) => [second, first]);

const LocationPolygon = ({
  boundingPolygon,
  locationSource,
  centerPoint: {
    geometry: { coordinates: centerCoordinates },
  },
}: LocationWithPolygon) => {
  const map = useMap();
  const { setCustomLocationPolygon } = usePlantSearchContext();

  const centerPoint: LatLngTuple = useMemo(
    () => [centerCoordinates[1], centerCoordinates[0]],
    [centerCoordinates]
  );

  const showMeridianWarning = useMemo(() => {
    const { coordinates } = boundingPolygon.geometry;
    const hasCoords: Record<string, boolean> = { "180": false, "-180": false };

    coordinates[0].forEach(([lng]) => {
      if ([180, -180].includes(lng)) {
        hasCoords[String(lng)] = true;
      }
    });

    return hasCoords["180"] && hasCoords["-180"];
  }, [boundingPolygon.geometry]);

  useEffect(() => {
    locationSource === "search" &&
      map.setView(centerPoint, showMeridianWarning ? 1 : 10);
  }, [centerPoint, locationSource, map, showMeridianWarning]);

  // Only plotting outer ring of geometry
  const polyCoords = useMemo(
    () => swapLatLng(boundingPolygon.geometry.coordinates[0]),
    [boundingPolygon.geometry.coordinates]
  );

  const markerDragEnd = (e: LeafletEvent, index: number) => {
    const corner = e.target as MarkerType;
    const latLng = corner.getLatLng();
    const newCoords = polyCoords.map((coord, coordIndex) =>
      coordIndex === index ||
      (index === 0 && coordIndex === polyCoords.length - 1)
        ? [latLng.lat, latLng.lng]
        : coord
    );

    setCustomLocationPolygon(swapLatLng(newCoords));
  };

  return (
    <>
      <Polygon positions={polyCoords}>
        {showMeridianWarning && (
          <Tooltip position={centerPoint} direction="top">
            Bounding boxes crossing the international date line will not display
            correctly
          </Tooltip>
        )}
      </Polygon>

      {polyCoords.slice(0, -1).map((point, index) => (
        // Omit connecting point at end
        <Marker
          key={index}
          position={point}
          draggable
          eventHandlers={{
            dragend: (e) => markerDragEnd(e, index),
          }}
        />
      ))}
    </>
  );
};

export default LocationPolygon;
