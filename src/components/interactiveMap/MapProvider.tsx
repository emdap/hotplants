import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import LocationPolygon from "./LocationPolygon";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  className: "min-h-60 min-w-30 z-0",
  zoom: 0,
  center: [0, 0],
};

// Create another component for plotting plant images on map
// Use https://github.com/Leaflet/Leaflet.markercluster
// Create custom styles for markers

const MapProvider = ({ className, ...containerProps }: MapContainerProps) => {
  const { searchLocation } = usePlantSearchContext();
  return (
    <MapContainer
      {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}
      className={classNames(DEFAULT_CONTAINER_PROPS.className, className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {searchLocation && <LocationPolygon {...searchLocation} />}
    </MapContainer>
  );
};

export default MapProvider;
