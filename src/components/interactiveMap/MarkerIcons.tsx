import classNames from "classnames";
import { DivIcon, Icon } from "leaflet";

export const PolygonCornerIcon = new DivIcon({
  className: "leaflet-icon h-4 w-4",
});

export const PolygonCenterIcon = new DivIcon({
  className: "!bg-transparent !border-0 backdrop-invert h-2 w-2",
});

export const OccurrenceMarkerIcon = (iconUrl: string, isActive: boolean) =>
  new Icon({
    iconUrl,
    className: classNames(
      "h-10 aspect-square !bg-gray-800/50 !border-none",
      isActive && "!outline-2 outline-white"
    ),
  });
