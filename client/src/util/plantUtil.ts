import { PlantResult } from "contexts/plantSelection/PlantSelectionContext";
import { capitalize } from "lodash";

export const getPlantDisplayNames = (plant: PlantResult) => {
  const commonName = plant.commonNames?.[0];
  return {
    title: commonName ? capitalize(commonName) : plant.scientificName,
    subTitle: commonName ? plant.scientificName : undefined,
  };
};
