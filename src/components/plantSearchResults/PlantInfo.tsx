import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";

const PlantInfo = ({ plant }: { plant: PlantResult }) => {
  return (
    <Card onClick={(e) => e.stopPropagation()}>{plant.scientificName}</Card>
  );
};

export default PlantInfo;
