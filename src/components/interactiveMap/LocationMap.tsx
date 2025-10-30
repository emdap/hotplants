import { polygon } from "@turf/turf";
import { Feature, Polygon as GeoPolygon, Position } from "geojson";
import { LeafletEvent, Marker as MarkerType } from "leaflet";
import { useEffect, useMemo } from "react";
import { Marker, Polygon, useMap } from "react-leaflet";
import { LocationWithBoundingBox } from "schemaHelpers/schemaTypesUtil";

export type LocationMapProps = {
  defaultLocation: LocationWithBoundingBox;
  setBboxPoly: (bboxPoly: Feature<GeoPolygon>) => void;
};

// GeoJSON spec dictates lng, lat
// Leaflet uses lat, lng
const swapLatLng = (coords: Position[]): [number, number][] =>
  coords.map(([first, second]) => [second, first]);

const LocationMap = ({
  defaultLocation: { lat, lon: lng, bboxPoly },
  setBboxPoly,
}: LocationMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 10);
  }, [lat, lng, map]);

  // Only plotting outer ring of geometry
  const polyCoords = useMemo(
    () => swapLatLng(bboxPoly.geometry.coordinates[0]),
    [bboxPoly]
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

    setBboxPoly(polygon([swapLatLng(newCoords)]));
  };

  return (
    <>
      <Polygon positions={polyCoords} />
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

export default LocationMap;
