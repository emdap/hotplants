import { PlantSearchQueriesReturnType } from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";

export const RESULTS_PANE_ID = "results-pane";

export const VOID_FUNCTION = () => {};
const VOID_PROMISE_FUNCTION = async () => {};

export type PlantSearchContextType = {
  hasCurrentResults: boolean;
  totalResultsCount: number;

  searchParams: PlantSearchParams | null;

  searchParamsDraft: Partial<PlantSearchParams>;
  updateSearchParamsDraft: (newParams: Partial<PlantSearchParams>) => void;
  setSearchParamsDraft: Dispatch<SetStateAction<Partial<PlantSearchParams>>>;

  plantFilters: PlantSearchFilters;
  setPlantFilters: Dispatch<SetStateAction<PlantSearchFilters>>;
} & Pick<
  PlantSearchQueriesReturnType,
  "fetchNextPlantsPage" | "hasNextPage" | "searchStatus" | "searchRecordQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,
  totalResultsCount: 0,

  searchParams: null,

  searchParamsDraft: {},
  updateSearchParamsDraft: VOID_FUNCTION,
  setSearchParamsDraft: VOID_FUNCTION,

  plantFilters: {},
  setPlantFilters: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  hasNextPage: false,
  fetchNextPlantsPage: VOID_PROMISE_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
