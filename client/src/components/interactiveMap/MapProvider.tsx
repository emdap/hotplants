import classNames from "classnames";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { LocationWithPolygon } from "util/schemaTypesUtil";
import LocationDrawings from "./LocationDrawings";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  worldCopyJump: true,
  zoom: 2,
  center: [0, 0],
};

type MapProviderProps = {
  locationArea?: LocationWithPolygon | null;
  showAllPlants?: boolean;
  isLoading?: boolean;
} & MapContainerProps;

const MapProvider = ({
  locationArea,
  showAllPlants,
  isLoading,
  className,
  ...containerProps
}: MapProviderProps) => (
  <Card
    className={classNames(
      "min-h-60 min-w-30 p-0 overflow-hidden relative",
      className
    )}
  >
    <LoadingOverlay
      show={isLoading}
      size={40}
      className="absolute h-full w-full"
    />

    <MapContainer
      className="w-full h-full z-0 !bg-transparent"
      {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationDrawings
        isCustomizeable={Boolean(showAllPlants)}
        locationArea={locationArea}
      />

      {/* <PlantOccurrenceMarkers showAllPlants={showAllPlants} /> */}
    </MapContainer>
  </Card>
);

export default MapProvider;
