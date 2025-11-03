import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import LocationPolygon from "./LocationPolygon";
import PlantOccurrenceMarkers from "./PlantOccurrenceMarkers";
import PolygonDrawer from "./PolygonDrawer";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  worldCopyJump: true,
  zoom: 2,
  center: [0, 0],
};

const MapProvider = ({
  showAllPlants,
  className,
  ...containerProps
}: MapContainerProps & { showAllPlants?: boolean }) => {
  const { searchLocation, activeIndexes } = usePlantSearchContext();
  return (
    <Card className={classNames("min-h-60 min-w-30 !p-0", className)}>
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
            enableDrag={activeIndexes.plantIndex === null}
            {...searchLocation}
          />
        )}

        {showAllPlants && <PolygonDrawer />}
        <PlantOccurrenceMarkers showAllPlants={showAllPlants} />
      </MapContainer>
    </Card>
  );
};

export default MapProvider;
