import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { swapLatLng } from "util/locationUtil";
import { MarkerClusterIcon, OccurrenceMarkerIcon } from "./MarkerIcons";

const PlantOccurrenceMarkers = () => {
  const map = useMap();
  const { activePlantMedia, activeMediaUrl, setActiveMediaUrl } =
    usePlantSelectionContext();

  return (
    <MarkerClusterGroup
      key={activeMediaUrl}
      zoomToBoundsOnClick={false}
      spiderfyOnEveryZoom
      iconCreateFunction={(data) =>
        MarkerClusterIcon(data, activePlantMedia[0]?.url)
      }
      maxClusterRadius={80}
    >
      {activePlantMedia.map(({ occurrenceCoords, url }, index) => {
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

export default PlantOccurrenceMarkers;
