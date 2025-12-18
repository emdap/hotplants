import { Feature, Polygon } from "geojson";
import { DrawEvents } from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

export type SetCustomPolygonFn = (boundingPolygon: Feature<Polygon>) => void;

const PolygonDrawing = ({
  setCustomPolygon,
}: {
  setCustomPolygon: SetCustomPolygonFn;
}) => {
  const createdDrawing = ({ layer }: DrawEvents.Created) => {
    const geojson = layer.toGeoJSON();
    setCustomPolygon(geojson);
    layer.remove();
  };

  return (
    <FeatureGroup>
      <EditControl
        position="topleft"
        edit={{ edit: false }}
        onCreated={createdDrawing}
        draw={{
          polyline: false,
          marker: false,
          circle: false,
          circlemarker: false,
          // Rectangle drawings appear to be bugged
          rectangle: false,
        }}
      />
    </FeatureGroup>
  );
};

export default PolygonDrawing;
