import { useEntitySelectionContext } from "contexts/entitySelection/EntitySelectionContext";
import { Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { swapLatLng } from "util/locationUtil";
import { MarkerClusterIcon, OccurrenceMarkerIcon } from "./MarkerIcons";

const EntityOccurrenceMarkers = () => {
  const map = useMap();
  const { activeEntityMedia, activeMediaUrl, setActiveMediaUrl } =
    useEntitySelectionContext();

  return (
    <MarkerClusterGroup
      key={activeMediaUrl}
      zoomToBoundsOnClick={false}
      spiderfyOnEveryZoom
      iconCreateFunction={(data) =>
        MarkerClusterIcon(data, activeEntityMedia[0]?.url)
      }
      maxClusterRadius={80}
    >
      {activeEntityMedia.map(({ occurrenceCoords, url }, index) => {
        // Encountered case of missing coordinates
        if (occurrenceCoords.length !== 2) {
          return null;
        }

        const isActive = url === activeMediaUrl;
        isActive &&
          map.fitBounds(swapLatLng([occurrenceCoords]), {
            maxZoom: map.getZoom(),
          });

        return (
          <Marker
            key={index}
            position={[occurrenceCoords[1], occurrenceCoords[0]]}
            icon={OccurrenceMarkerIcon(url, isActive)}
            eventHandlers={{
              click: () => setActiveMediaUrl(url),
            }}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default EntityOccurrenceMarkers;
