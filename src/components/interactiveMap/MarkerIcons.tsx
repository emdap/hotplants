import { DivIcon, Icon } from "leaflet";

export const PolygonCornerIcon = new DivIcon({
  className: "leaflet-icon h-4 w-4",
});

export const PolygonCenterIcon = new DivIcon({
  className: "!bg-transparent !border-0 backdrop-invert h-2 w-2",
});

export const OccurrenceMarkerIcon = (iconUrl: string) =>
  new Icon({
    iconUrl,
    className: "rounded-full h-10 aspect-square",
  });
