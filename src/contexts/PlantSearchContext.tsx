import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

export const VOID_FUNCTION = () => {};
export const FILTER_HOLDER_ID = "filter-holder";

export type FullScreenElement = "IMAGE_VIEWER";
export type ActiveIndexes = Record<"plantIndex" | "mediaIndex", number | null>;

type PlantSearchContextType = {
  plantSearchResults: PlantQueryResults;
  activeIndexes: ActiveIndexes;
  setActiveIndexes: Dispatch<SetStateAction<ActiveIndexes>>;
  syncPlant: (plantId: string) => void;

  searchLocation: LocationWithPolygon | null;
  setSearchLocation: (location: LocationWithPolygon | null) => void;
  setCustomLocationPolygon: (boundingPolygon: Feature<Polygon>) => void;

  searchLocationLoading: boolean;
  setSearchLocationLoading: (loading: boolean) => void;

  fullScreenElement: FullScreenElement | null;
  setFullScreenElement: (element: FullScreenElement | null) => void;
};

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  plantSearchResults: [],
  activeIndexes: { plantIndex: null, mediaIndex: null },
  setActiveIndexes: VOID_FUNCTION,

  syncPlant: VOID_FUNCTION,

  searchLocation: null,
  setSearchLocation: VOID_FUNCTION,
  setCustomLocationPolygon: VOID_FUNCTION,

  searchLocationLoading: false,
  setSearchLocationLoading: VOID_FUNCTION,

  fullScreenElement: null,
  setFullScreenElement: VOID_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
