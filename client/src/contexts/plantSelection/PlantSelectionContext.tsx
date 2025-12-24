import { VOID_FUNCTION } from "contexts/plantSearch/PlantSearchContext";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

type PlantSelectionContextType = {
  plantList: PlantQueryResults;

  activePlantIndex: number | null;
  activeMediaIndex: number | null;
  setActivePlantIndex: Dispatch<SetStateAction<number | null>>;
  setActiveMediaIndex: Dispatch<SetStateAction<number | null>>;

  syncPlant: (plantId: string) => void;
};

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSelectionContextType = {
  plantList: [],

  activePlantIndex: null,
  activeMediaIndex: null,
  setActivePlantIndex: VOID_FUNCTION,
  setActiveMediaIndex: VOID_FUNCTION,

  syncPlant: VOID_FUNCTION,
};

export const PlantSelectionContext = createContext<PlantSelectionContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSelectionContext = () => useContext(PlantSelectionContext);
