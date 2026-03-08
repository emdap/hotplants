import {
  centroid,
  point,
  polygon,
  rhumbBearing,
  rhumbDistance,
  transformTranslate,
} from "@turf/turf";
import { Feature, Polygon as PolygonType } from "geojson";
import { LeafletEvent, Marker as MarkerType } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Marker, Polygon, useMap } from "react-leaflet";
import { useMount } from "react-use";
import { LocationCoord, PlantLocationParams } from "util/customSchemaTypes";
import CrossingMeridianTooltip from "./CrossingMeridianTooltip";
import { PolygonCenterIcon, PolygonCornerIcon } from "./MarkerIcons";
import { SetCustomPolygonFn } from "./PolygonDrawing";

// GeoJSON spec dictates lng, lat
// Leaflet uses lat, lng
const swapLatLng = (coords: number[][] | LocationCoord[]): LocationCoord[] =>
  coords.map(([first, second]) => [second, first]);

const getOuterCoordinates = (feature: Feature<PolygonType>) =>
  feature.geometry.coordinates[0];

const LocationPolygon = ({
  boundingPolyCoords,
  locationSource,
  locationCustomizeable,
  setCustomPolygon,
}: PlantLocationParams & {
  locationCustomizeable?: boolean;
  setCustomPolygon: SetCustomPolygonFn;
}) => {
  const map = useMap();
  useMount(() => map.fitBounds(polyCoords));

  const boundingPolygon = useMemo(
    () => polygon(boundingPolyCoords),
    [boundingPolyCoords],
  );
  const [localPolygon, setLocalPolygon] = useState(boundingPolygon);

  useEffect(() => {
    setLocalPolygon(boundingPolygon);
  }, [boundingPolygon]);

  // Only plotting outer ring of geometry
  const { polyCoords, centerCoords } = useMemo(() => {
    const center = centroid(localPolygon).geometry.coordinates;
    const outerCoords = getOuterCoordinates(localPolygon);
    return {
      centerCoords: [center[1], center[0]] as [number, number],
      polyCoords: swapLatLng(outerCoords),
    };
  }, [localPolygon]);

  useEffect(() => {
    if (locationSource === "search") {
      const outerCoords = getOuterCoordinates(boundingPolygon);
      map.fitBounds(swapLatLng(outerCoords));
    }
  }, [boundingPolygon, locationSource, map]);

  const centerDragEnd = (e: LeafletEvent) => {
    const centerMarker = e.target as MarkerType;
    const { lat, lng } = centerMarker.getLatLng();

    const currentCenter = point([centerCoords[1], centerCoords[0]]);
    const newCenter = point([lng, lat]);

    const bearing = rhumbBearing(currentCenter, newCenter);
    const distance = rhumbDistance(currentCenter, newCenter);

    const translatedPoly = transformTranslate(localPolygon, distance, bearing);

    setLocalPolygon(translatedPoly);
  };

  const cornerDragEnd = (e: LeafletEvent, index: number) => {
    const cornerMarker = e.target as MarkerType;
    const latLng = cornerMarker.getLatLng();
    const newCoords = polyCoords.map((coord, coordIndex) =>
      coordIndex === index ||
      (index === 0 && coordIndex === polyCoords.length - 1)
        ? [latLng.lat, latLng.lng]
        : coord,
    );

    const swappedCoords = swapLatLng(newCoords);
    setLocalPolygon(polygon([swappedCoords]));
  };

  const savePolygon = () => setCustomPolygon(localPolygon);

  return (
    <>
      <Polygon
        className="stroke-cyan-900 fill-cyan-400"
        positions={polyCoords}
      />
      <CrossingMeridianTooltip
        centerCoords={centerCoords}
        boundingPolyCoords={localPolygon.geometry.coordinates}
      />

      {locationCustomizeable && (
        <>
          <Marker
            icon={PolygonCenterIcon}
            position={centerCoords}
            draggable
            eventHandlers={{
              drag: centerDragEnd,
              dragend: savePolygon,
            }}
          />
          {polyCoords.slice(0, -1).map((point, index) => (
            // Omit connecting point at end
            <Marker
              icon={PolygonCornerIcon}
              key={index}
              position={point}
              draggable
              eventHandlers={{
                drag: (e) => cornerDragEnd(e, index),
                dragend: savePolygon,
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default LocationPolygon;
