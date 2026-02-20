import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";

export const getPlantDisplayName = (plant: PlantResult) => {
  const commonName = plant.commonNames?.[0];
  return commonName ? capitalize(commonName) : plant.scientificName;
};
