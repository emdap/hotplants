import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import LocationMap, { LocationMapProps } from "./LocationMap";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  className: "h-full",
  zoom: 3,
  center: [0, 0],
};

const MapProvider = ({
  containerProps = DEFAULT_CONTAINER_PROPS,
  ...locationMapProps
}: LocationMapProps & { containerProps?: MapContainerProps }) => (
  <MapContainer {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationMap {...locationMapProps} />
  </MapContainer>
);

export default MapProvider;
