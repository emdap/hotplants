import { DivIcon, Icon } from "leaflet";

export const PolygonCornerIcon = new DivIcon({
  className: "rounded-full bg-yellow-400 border-2 border-orange-800 h-4 w-4",
});

export const PolygonCenterIcon = new DivIcon({
  className: "backdrop-invert h-2 w-2",
});

export const OccurrenceMarkerIcon = (iconUrl: string) =>
  new Icon({
    iconUrl,
    className: "rounded-full h-10 aspect-square",
  });
