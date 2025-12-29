import { centroid } from "@turf/turf";
import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import LocationPolygon from "./LocationPolygon";
import PlantOccurrenceMarkers from "./PlantOccurrenceMarkers";
import PolygonDrawing, { SetCustomPolygonFn } from "./PolygonDrawing";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  worldCopyJump: true,
  zoom: 2,
  center: [0, 0],
};

type MapProviderProps = {
  isLoading?: boolean;
  showMarkers?: boolean;
  locationCustomizeable?: boolean;
} & MapContainerProps;

const MapProvider = ({
  isLoading,
  showMarkers,
  locationCustomizeable,
  className,
  ...containerProps
}: MapProviderProps) => {
  const { searchLocation, setSearchLocation } = usePlantSearchContext();

  const setCustomPolygon: SetCustomPolygonFn = (boundingPolygon) => {
    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);
    setSearchLocation({
      displayName: `${lat}, ${lng}`,
      locationSource: "map",
      boundingPolygon,
    });
  };

  return (
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

        {searchLocation && (
          <LocationPolygon
            {...{
              locationCustomizeable,
              setCustomPolygon,
              ...searchLocation,
            }}
          />
        )}

        {locationCustomizeable && (
          <PolygonDrawing setCustomPolygon={setCustomPolygon} />
        )}

        {showMarkers && <PlantOccurrenceMarkers />}
      </MapContainer>
    </Card>
  );
};

export default MapProvider;
