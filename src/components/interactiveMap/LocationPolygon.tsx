import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { LeafletEvent, Marker as MarkerType } from "leaflet";
import { useEffect, useMemo } from "react";
import { Marker, Polygon, useMap } from "react-leaflet";
import { useMount } from "react-use";
import { LocationCoord } from "schemaHelpers/customSchemaTypes";
import { LocationWithPolygon } from "schemaHelpers/schemaTypesUtil";
import CrossingMerdianTooltip from "./CrossingMerdianTooltip";

// GeoJSON spec dictates lng, lat
// Leaflet uses lat, lng
const swapLatLng = (coords: number[][] | LocationCoord[]): LocationCoord[] =>
  coords.map(([first, second]) => [second, first]);

const LocationPolygon = ({
  boundingPolygon,
  locationSource,
  centerPoint,
}: LocationWithPolygon) => {
  const map = useMap();
  useMount(() => map.fitBounds(polyCoords));

  const { setCustomLocationPolygon } = usePlantSearchContext();

  // Only plotting outer ring of geometry
  const polyCoords = useMemo(
    () => swapLatLng(boundingPolygon.geometry.coordinates[0]),
    [boundingPolygon.geometry.coordinates]
  );

  useEffect(() => {
    if (locationSource === "search") {
      map.fitBounds(polyCoords);
    }
  }, [polyCoords, locationSource, map]);

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
      <Polygon positions={polyCoords} />
      <CrossingMerdianTooltip {...{ centerPoint, boundingPolygon }} />
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
