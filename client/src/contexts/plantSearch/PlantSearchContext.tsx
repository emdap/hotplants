import { PlantSearchQueriesReturnType } from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { PlantSearchFilters, PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

export const RESULTS_PANE_ID = "results-pane";

export const VOID_FUNCTION = () => {};
const VOID_PROMISE_FUNCTION = async () => {};

export type PlantSearchContextType = {
  hasCurrentResults: boolean;
  totalResultsCount: number;
  page?: number;

  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;

  searchParams: PlantSearchParams | null;
  searchParamsDraft: PlantSearchParams | null;
  setSearchParamsDraft: Dispatch<SetStateAction<PlantSearchParams | null>>;
  updateSearchParamsDraft: (
    locationParams: Pick<
      PlantSearchParams,
      "boundingPolyCoords" | "locationName" | "locationSource"
    >
  ) => void;
  applySearchParams: (params?: PlantSearchParams) => void;

  plantFilters: PlantSearchFilters;
  applyPlantFilters: (filters?: PlantSearchFilters) => void;
} & Pick<
  PlantSearchQueriesReturnType,
  "fetchNextPlantsPage" | "hasNextPage" | "searchStatus" | "searchRecordQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,
  totalResultsCount: 0,

  searchParams: null,

  sidebarExpanded: !isSmallScreen(),
  setSidebarExpanded: VOID_FUNCTION,

  searchParamsDraft: null,
  setSearchParamsDraft: VOID_FUNCTION,
  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,

  plantFilters: {},
  applyPlantFilters: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  hasNextPage: false,
  fetchNextPlantsPage: VOID_PROMISE_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
