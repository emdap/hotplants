import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { DrawEvents } from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const PolygonDrawing = () => {
  const { setCustomLocationPolygon } = usePlantSearchContext();

  const createdDrawing = ({ layer }: DrawEvents.Created) => {
    const geojson = layer.toGeoJSON();
    setCustomLocationPolygon(geojson);
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
