import classNames from "classnames";
import { DivIcon, Icon, MarkerCluster } from "leaflet";

export const PolygonCornerIcon = new DivIcon({
  className: "leaflet-icon h-4 w-4",
});

export const PolygonCenterIcon = new DivIcon({
  className: "!bg-transparent !border-0 backdrop-invert h-2 w-2",
});

export const OccurrenceMarkerIcon = (iconUrl: string, isActive: boolean) =>
  new Icon({
    iconUrl,
    // Re-using this property to pass information to MarkerClusterGroup
    pane: isActive ? "active" : undefined,
    className: classNames(
      "h-10 aspect-square !bg-gray-800/50 !border-none",
      isActive && "!outline-2 outline-white"
    ),
  });

export const MarkerClusterIcon = (cluster: MarkerCluster) => {
  const children = cluster.getAllChildMarkers();

  const activeChild = children.find(
    ({ options: { icon } }) => icon?.options.pane === "active"
  );

  const activeIconUrl = activeChild
    ? activeChild.options.icon?.options.iconUrl
    : children[0]?.options.icon?.options.iconUrl;

  return activeIconUrl
    ? OccurrenceMarkerIcon(activeIconUrl, !!activeChild)
    : new DivIcon({ html: "N/A" });
};
