import Card from "designSystem/Card";
import { PlantDataInput } from "generated/graphql/graphql";

const PlantCharacteristicsFilter = ({
  setPlantFilterInput: _setPlantFilterInput,
}: {
  setPlantFilterInput: (
    filters: Omit<PlantDataInput, "boundingBox"> | null
  ) => void;
}) => {
  return <Card> PlantCharacteristicsFilter </Card>;
};

export default PlantCharacteristicsFilter;
