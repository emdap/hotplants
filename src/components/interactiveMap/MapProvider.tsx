import { useState } from "react";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";
import {
  LocationWithBoundingBox,
  validateLocationData,
} from "schemaHelpers/schemaTypesUtil";
import LocationMap, { LocationMapProps } from "./LocationMap";

const DEFAULT_CONTAINER_PROPS: MapContainerProps = {
  className: "h-full",
  zoom: 3,
  center: [0, 0],
};

const TEMP_PROPS = validateLocationData({
  boundingbox: ["45.4325360", "45.6528812", "-122.8367489", "-122.4720252"],
  lat: 45.5202471,
  lon: -122.674194,
}) as LocationWithBoundingBox;

const MapProvider = ({
  containerProps = DEFAULT_CONTAINER_PROPS,
  ...locationMapProps
}: Partial<LocationMapProps> & { containerProps?: MapContainerProps }) => {
  const [bboxPoly, setBboxPoly] = useState(TEMP_PROPS.bboxPoly);

  return (
    <MapContainer {...{ ...DEFAULT_CONTAINER_PROPS, ...containerProps }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMap
        {...locationMapProps}
        defaultLocation={{
          ...TEMP_PROPS,
          bboxPoly,
        }}
        setBboxPoly={setBboxPoly}
      />
    </MapContainer>
  );
};

export default MapProvider;
