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
  const meridanTooltip = useRef<TooltipType>(null);

  useEffect(() => {
    const coordinates = boundingPolyCoords[0];

    if (!crossesMeridian(coordinates)) {
      meridanTooltip.current?.remove();
      meridanTooltip.current = null;
    } else if (!meridanTooltip.current) {
      meridanTooltip.current = tooltip({ direction: "bottom", permanent: true })
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
