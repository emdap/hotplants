import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";

const PlantInfo = ({ plant }: { plant: PlantResult }) => {
  return <Card> {plant.scientificName} </Card>;
};

export default PlantInfo;
