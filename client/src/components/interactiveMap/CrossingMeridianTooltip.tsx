import { PlantLocationParams } from "config/hotplantsConfig";
import { tooltip, Tooltip as TooltipType } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { crossesMeridian } from "util/locationUtil";

const CrossingMeridianTooltip = ({
  boundingPolyCoords,
  centerCoords,
}: Pick<PlantLocationParams, "boundingPolyCoords"> & {
  centerCoords: [number, number];
}) => {
  const map = useMap();
  const meridanTooltipRef = useRef<TooltipType>(null);

  useEffect(() => {
    const coordinates = boundingPolyCoords[0];

    if (!crossesMeridian(coordinates)) {
      meridanTooltipRef.current?.remove();
      meridanTooltipRef.current = null;
    } else if (!meridanTooltipRef.current) {
      meridanTooltipRef.current = tooltip({
        direction: "bottom",
        permanent: true,
      })
        .setContent(
          "Bounding boxes crossing the international<br />date line will not be interpreted correctly",
        )
        .setLatLng(centerCoords)
        .addTo(map);
    }
  }, [boundingPolyCoords, centerCoords, map]);

  return null;
};

export default CrossingMeridianTooltip;
