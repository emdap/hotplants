import { createContext, useContext } from "react";
import { LocationCoord } from "schemaHelpers/customSchemaTypes";
import { LocationWithPolygon } from "schemaHelpers/schemaTypesUtil";

export const VOID_FUNCTION = () => {};

export type FullScreenElement = "IMAGE_VIEWER";

type PlantSearchContextType = {
  syncPlant: (plantId: string) => void;

  searchLocation: LocationWithPolygon | null;
  setSearchLocation: (location: LocationWithPolygon | null) => void;
  setCustomLocationPolygon: (coordinates: LocationCoord[]) => void;

  fullScreenElement: FullScreenElement | null;
  setFullScreenElement: (element: FullScreenElement | null) => void;
};

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  syncPlant: VOID_FUNCTION,

  searchLocation: null,
  setSearchLocation: VOID_FUNCTION,
  setCustomLocationPolygon: VOID_FUNCTION,

  fullScreenElement: null,
  setFullScreenElement: VOID_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
