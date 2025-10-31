import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import LocationPolygon from "./LocationPolygon";
import PlantOccurrenceMarkers from "./PlantOccurrenceMarkers";
import PolygonDrawer from "./PolygonDrawer";

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
  const { searchLocation, activePlantIndexes } = usePlantSearchContext();
  return (
    <MapContainer
      {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}
      className={classNames("min-h-60 min-w-30 z-0", className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {searchLocation && (
        <LocationPolygon
          enableDrag={activePlantIndexes.plantIndex === null}
          {...searchLocation}
        />
      )}

      {showAllPlants && <PolygonDrawer />}
      <PlantOccurrenceMarkers showAllPlants={showAllPlants} />
    </MapContainer>
  );
};

export default MapProvider;
