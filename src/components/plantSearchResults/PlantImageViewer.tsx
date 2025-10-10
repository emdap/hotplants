import Card from "designSystem/Card";
import { PlantResult } from "graphqlQueries/plantQueries";

const PlantImageViewer = ({ plant }: { plant: PlantResult }) => {
  return (
    <Card className="w-30 p-0!">
      <img src={plant.mediaUrls[0]} />
    </Card>
  );
};

export default PlantImageViewer;
