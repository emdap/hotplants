import { simplify } from "@turf/turf";
import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import { LocationData } from "schemaHelpers/customSchemaTypes";
import {
  LocationWithBoundingBox,
  validateLocationData,
} from "schemaHelpers/schemaTypesUtil";

export type LocationMapProps = {
  location?: LocationWithBoundingBox;
};

const DEMO_DATA = validateLocationData({
  place_id: 304557507,
  licence:
    "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
  osm_type: "relation",
  osm_id: 186579,
  lat: "45.5202471",
  lon: "-122.6741940",
  class: "boundary",
  type: "administrative",
  place_rank: 16,
  importance: 0.7031502045217687,
  addresstype: "city",
  name: "Portland",
  display_name: "Portland, Multnomah County, Oregon, United States",
  address: {
    city: "Portland",
    county: "Multnomah County",
    state: "Oregon",
    "ISO3166-2-lvl4": "US-OR",
    country: "United States",
    country_code: "us",
  },
  boundingbox: ["45.4325360", "45.6528812", "-122.8367489", "-122.4720252"],
  geojson: {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [-122.72526, 45.5255174],
          [-122.730163, 45.520872],
          [-122.741247, 45.5266728],
          [-122.7472179, 45.5253662],
          [-122.7197257, 45.5141542],
          [-122.743706, 45.4332855],
          [-122.6661459, 45.4327412],
          [-122.4727995, 45.5589117],
          [-122.8365257, 45.609531],
          [-122.72526, 45.5255174],
        ],
        [
          [-122.7466076, 45.4662916],
          [-122.7449376, 45.4664443],
          [-122.7449351, 45.465752],
          [-122.7466013, 45.4657569],
          [-122.7466076, 45.4662916],
        ],
        [
          [-122.7352033, 45.517098],
          [-122.7311177, 45.5172308],
          [-122.7300395, 45.5144106],
          [-122.7351766, 45.5144613],
          [-122.7352033, 45.517098],
        ],
        [
          [-122.7259305, 45.5230364],
          [-122.7256767, 45.5236],
          [-122.7242952, 45.5236266],
          [-122.724266, 45.5230246],
          [-122.7259305, 45.5230364],
        ],
        [
          [-122.72526, 45.5255174],
          [-122.7243486, 45.5260341],
          [-122.7234694, 45.5241533],
          [-122.7240538, 45.5240661],
          [-122.72526, 45.5255174],
        ],
        [
          [-122.6730492, 45.440293],
          [-122.6729436, 45.4425367],
          [-122.6705292, 45.4405325],
          [-122.6705221, 45.4402967],
          [-122.6730492, 45.440293],
        ],
        [
          [-122.5682684, 45.5566657],
          [-122.5577728, 45.5553888],
          [-122.5578372, 45.5462865],
          [-122.5682526, 45.553565],
          [-122.5682684, 45.5566657],
        ],
        [
          [-122.4933625, 45.4863221],
          [-122.4901602, 45.4863415],
          [-122.4907362, 45.485466],
          [-122.4933625, 45.4863221],
        ],
      ],
      [
        [
          [-122.5860606, 45.4625622],
          [-122.5860575, 45.4624392],
          [-122.5854952, 45.4624425],
          [-122.5854956, 45.462565],
          [-122.5860606, 45.4625622],
        ],
      ],
    ],
  },
} as unknown as LocationData) as unknown as LocationWithBoundingBox;

const LocationMap = ({ location = DEMO_DATA }: LocationMapProps) => {
  const center: LatLngExpression = [location.lat, location.lon];
  const test = useMap();

  useEffect(() => {
    test.setView([location.lat, location.lon], 13);
  }, [location.lat, location.lon, test]);

  console.log(location.boundingBox);
  console.log(
    location.geojson && simplify(location.geojson, { tolerance: 0.01 })
  );

  return (
    <Marker position={center}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
      {/* {location && ( */}
      {location.geojson && <GeoJSON data={location.geojson} />}
      {/* )} */}
    </Marker>
  );
};

export default LocationMap;
