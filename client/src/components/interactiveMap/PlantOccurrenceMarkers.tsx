import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MarkerClusterIcon, OccurrenceMarkerIcon } from "./MarkerIcons";

const PlantOccurrenceMarkers = () => {
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
      {activePlantMedia.map(({ occurrenceCoords, url }, index) => (
        <Marker
          key={index}
          position={[occurrenceCoords[1], occurrenceCoords[0]]}
          icon={OccurrenceMarkerIcon(url, url === activeMediaUrl)}
          eventHandlers={{
            click: () => setActiveMediaUrl(url),
          }}
        />
      ))}
    </MarkerClusterGroup>
  );
};

export default PlantOccurrenceMarkers;
