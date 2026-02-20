import { VOID_FUNCTION } from "contexts/plantSearch/PlantSearchContext";
import {
  PlantMediaObject,
  PlantOccurrence,
  PlantQueryResults,
  PlantResult,
} from "graphqlHelpers/plantQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type FlattenedPlantMedia = (Omit<PlantOccurrence, "media"> &
  PlantMediaObject)[];

type PlantSelectionContextType = {
  plantList: PlantQueryResults;

  activePlantId: string | null;
  activePlant?: PlantResult;
  activePlantMedia: FlattenedPlantMedia | [];
  activeMediaUrl: string | null;

  setActivePlantId: Dispatch<SetStateAction<string | null>>;
  setActiveMediaUrl: Dispatch<SetStateAction<string | null>>;

  syncPlant: (plantId: string) => void;
};

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSelectionContextType = {
  plantList: [],

  activePlantId: null,
  activePlantMedia: [],
  activeMediaUrl: null,

  setActivePlantId: VOID_FUNCTION,
  setActiveMediaUrl: VOID_FUNCTION,

  syncPlant: VOID_FUNCTION,
};

export const PlantSelectionContext = createContext<PlantSelectionContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT,
);

export const usePlantSelectionContext = () => useContext(PlantSelectionContext);
