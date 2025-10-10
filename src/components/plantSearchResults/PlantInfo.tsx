import Card from "designSystem/Card";
import { PlantResult } from "graphqlQueries/plantQueries";

const PlantInfo = ({ plant }: { plant: PlantResult }) => {
  return <Card> {plant.scientificName} </Card>;
};

export default PlantInfo;
