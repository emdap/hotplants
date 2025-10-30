import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import LocationMap, { LocationMapProps } from "./LocationMap";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  className: "h-full",
  zoom: 0,
  center: [0, 0],
};

const MapProvider = ({
  defaultLocation,
  setBboxPoly,
  ...containerProps
}: MapContainerProps & Partial<LocationMapProps>) => {
  return (
    <MapContainer {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {defaultLocation && setBboxPoly && (
        <LocationMap {...{ defaultLocation, setBboxPoly }} />
      )}
    </MapContainer>
  );
};

export default MapProvider;
