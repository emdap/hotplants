import { Position } from "geojson";
import { tooltip, Tooltip as TooltipType } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { LocationSearchParams } from "util/locationUtil";

const crossesMeridian = (coordinates: Position[]) => {
  const hasCoords: Record<string, boolean> = { "180": false, "-180": false };
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

const CrossingMerdianTooltip = ({
  boundingPolyCoords,
  centerCoords,
}: Pick<LocationSearchParams, "boundingPolyCoords"> & {
  centerCoords: [number, number];
}) => {
  const map = useMap();
  const meridanTooltip = useRef<TooltipType>(null);

  useEffect(() => {
    const coordinates = boundingPolyCoords[0];

    if (!crossesMeridian(coordinates)) {
      meridanTooltip.current?.remove();
      meridanTooltip.current = null;
    } else if (!meridanTooltip.current) {
      meridanTooltip.current = tooltip({ direction: "bottom", permanent: true })
        .setContent(
          "Bounding boxes crossing the international<br />date line will not display correctly"
        )
        .setLatLng(centerCoords)
        .addTo(map);
    }
  }, [boundingPolyCoords, centerCoords, map]);

  return null;
};

export default CrossingMerdianTooltip;
