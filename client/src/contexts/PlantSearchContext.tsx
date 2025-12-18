import { PlantDataInput } from "generated/graphql/graphql";
import { Feature, Polygon } from "geojson";
import { PlantQueryResults } from "graphqlHelpers/plantQueries";
import { PlantSearchQueriesReturnType } from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

export const FILTER_HOLDER_ID = "filter-holder";
export const VOID_FUNCTION = () => {};
const VOID_PROMISE_FUNCTION = async () => {};

export type FullScreenElement = "IMAGE_VIEWER";
export type ActiveIndexes = Record<"plantIndex" | "mediaIndex", number | null>;

type PlantSearchContextType = {
  plantSearchResults: PlantQueryResults;
  hasCurrentResults: boolean;
  totalResultsCount: number;

  activeIndexes: ActiveIndexes;
  setActiveIndexes: Dispatch<SetStateAction<ActiveIndexes>>;

  applyFilters: (newFilters: PlantDataInput) => Promise<void>;
  syncPlant: (plantId: string) => void;

  searchLocation: LocationWithPolygon | null;
  setSearchLocation: (location: LocationWithPolygon | null) => void;
  setCustomLocationPolygon: (boundingPolygon: Feature<Polygon>) => void;

  searchLocationLoading: boolean;
  setSearchLocationLoading: (loading: boolean) => void;

  fullScreenElement: FullScreenElement | null;
  setFullScreenElement: (element: FullScreenElement | null) => void;
} & Pick<
  PlantSearchQueriesReturnType,
  "fetchNextPlantsPage" | "hasNextPage" | "searchStatus" | "searchRecordQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  plantSearchResults: [],
  hasCurrentResults: false,
  totalResultsCount: 0,

  activeIndexes: { plantIndex: null, mediaIndex: null },
  setActiveIndexes: VOID_FUNCTION,

  syncPlant: VOID_FUNCTION,
  applyFilters: VOID_PROMISE_FUNCTION,

  searchLocation: null,
  setSearchLocation: VOID_FUNCTION,
  setCustomLocationPolygon: VOID_FUNCTION,

  searchLocationLoading: false,
  setSearchLocationLoading: VOID_FUNCTION,

  fullScreenElement: null,
  setFullScreenElement: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  hasNextPage: false,
  fetchNextPlantsPage: VOID_PROMISE_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
