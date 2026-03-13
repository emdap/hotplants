import classNames from "classnames";
import { DivIcon, MarkerCluster } from "leaflet";

export const PolygonCornerIcon = new DivIcon({
  className: "leaflet-icon h-4 w-4",
});

export const PolygonCenterIcon = new DivIcon({
  className: "!bg-transparent !border-0 backdrop-invert h-2 w-2",
});

export const OccurrenceMarkerIcon = (iconUrl: string, isActive: boolean) =>
  new DivIcon({
    iconUrl,
    // Add overflow-clip-margin: unset to prevent images from looking pixelated in chrome
    html: `<img loading="lazy" class="object-cover !w-full !h-full" style="overflow-clip-margin: unset" src="${iconUrl}"/>`,
    // Re-using this property to pass information to MarkerClusterGroup
    pane: isActive ? "active" : undefined,
    className: classNames(
      "!h-10 !w-10 overflow-hidden !bg-primary !border-purple-400",
      isActive && "!outline-2 !outline-white",
    ),
  });

export const MarkerClusterIcon = (
  cluster: MarkerCluster,
  defaultIconUrl?: string,
) => {
  const children = cluster.getAllChildMarkers();

  const activeChild = children.find(
    ({ options: { icon } }) => icon?.options.pane === "active",
  );

  const activeIconUrl = activeChild
    ? activeChild.getIcon().options.iconUrl
    : (children[children.length - 1]?.getIcon().options.iconUrl ??
      defaultIconUrl);

  return activeIconUrl
    ? OccurrenceMarkerIcon(activeIconUrl, Boolean(activeChild))
    : new DivIcon({ html: "N/A" });
};
