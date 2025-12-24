import { PlantDataInput } from "generated/graphql/graphql";
import { PlantSearchQueriesReturnType } from "hooks/usePlantSearchQueries";
import { createContext, useContext } from "react";
import { LocationWithPolygon } from "util/schemaTypesUtil";

export const FILTER_HOLDER_ID = "filter-holder";
export const VOID_FUNCTION = () => {};
const VOID_PROMISE_FUNCTION = async () => {};

export type ActiveIndexes = Record<"plantIndex" | "mediaIndex", number | null>;

type PlantSearchContextType = {
  hasCurrentResults: boolean;
  totalResultsCount: number;

  plantSearchCriteria: PlantDataInput | null;
  setPlantSearchCriteria: (newCriteria: PlantDataInput) => void;

  searchLocation: LocationWithPolygon | null;
  setSearchLocation: (location: LocationWithPolygon | null) => void;
} & Pick<
  PlantSearchQueriesReturnType,
  "fetchNextPlantsPage" | "hasNextPage" | "searchStatus" | "searchRecordQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,
  totalResultsCount: 0,

  plantSearchCriteria: null,
  setPlantSearchCriteria: VOID_FUNCTION,

  searchLocation: null,
  setSearchLocation: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  hasNextPage: false,
  fetchNextPlantsPage: VOID_PROMISE_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
