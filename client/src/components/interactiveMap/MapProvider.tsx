import { centroid } from "@turf/turf";
import classNames from "classnames";
import {
  EntitySearchParams,
  PlantLocationParams,
} from "config/hotplantsConfig";
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
  locationParams: EntitySearchParams["location"];
  setLocationParams?: (newParams: PlantLocationParams) => void;
} & MapContainerProps;

const MapProvider = ({
  locationParams: searchParams,
  setLocationParams: setSearchParams,

  isLoading,
  showMarkers,
  locationCustomizeable,
  className,
  ...containerProps
}: MapProviderProps) => {
  const setCustomPolygon: SetCustomPolygonFn = (boundingPolygon) => {
    if (!setSearchParams) {
      return;
    }

    const center = centroid(boundingPolygon).geometry.coordinates;
    const [lat, lng] = center.map((num) => Math.round(num * 100) / 100);
    setSearchParams({
      ...searchParams,
      locationName: `${lat}, ${lng}`,
      locationSource: "custom",
      boundingPolyCoords: boundingPolygon.geometry.coordinates,
    });
  };

  return (
    <Card
      className={classNames(
        "min-h-60 min-w-30 p-0 overflow-hidden relative",
        className,
      )}
    >
      <LoadingOverlay
        show={isLoading}
        iconSize={30}
        className="z-20 absolute"
        disableAnimationFallback
      />

      <MapContainer
        className="min-w-full min-h-full z-0 !bg-transparent"
        {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchParams && (
          <LocationPolygon
            {...{
              locationCustomizeable,
              setCustomPolygon,
              ...searchParams,
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
