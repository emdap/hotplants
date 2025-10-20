import { createContext, useContext } from "react";

const VOID_FUNCTION = () => {};

export type FullScreenElement = "IMAGE_VIEWER";

type PlantSearchContextType = {
  fullScreenElementState: [
    FullScreenElement | null,
    (element: FullScreenElement | null) => void
  ];
};

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  fullScreenElementState: [null, VOID_FUNCTION],
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
