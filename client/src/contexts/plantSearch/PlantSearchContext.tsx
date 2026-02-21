import {
  PlantSearchQueriesReturnType,
  PlantSearchQueryStatus,
} from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { PlantSearchFilter, PlantSearchParams } from "util/customSchemaTypes";
import { isSmallScreen } from "util/generalUtil";

export const VOID_FUNCTION = () => {};
const VOID_PROMISE_FUNCTION = async () => {};

export type PlantSearchContextType = {
  hasCurrentResults: boolean;
  totalResultsCount: number;

  isInfiniteScroll: boolean;
  setIsInfiniteScroll: (enabled: boolean) => void;

  searchParams: PlantSearchParams | null;
  searchParamsDraft: Partial<PlantSearchParams> | null;
  validatedSearchParamsDraft: PlantSearchParams | null;

  updateSearchParamsDraft: (locationParams: Partial<PlantSearchParams>) => void;
  applySearchParams: (params?: Partial<PlantSearchParams>) => void;

  plantFilter: PlantSearchFilter;
  applyPlantFilter: (filter?: PlantSearchFilter) => void;

  searchStatus: PlantSearchQueryStatus;
  fetchMorePlants: () => Promise<unknown>;

  sidebarExpanded: boolean;
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>;
} & Pick<
  PlantSearchQueriesReturnType,
  "searchRecordQuery" | "plantSearchQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,
  totalResultsCount: 0,

  isInfiniteScroll: !isSmallScreen(),
  setIsInfiniteScroll: VOID_FUNCTION,

  searchParams: null,
  searchParamsDraft: null,
  validatedSearchParamsDraft: null,

  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,

  plantFilter: {},
  applyPlantFilter: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  plantSearchQuery: {} as PlantSearchQueriesReturnType["plantSearchQuery"],
  fetchMorePlants: VOID_PROMISE_FUNCTION,

  sidebarExpanded: !isSmallScreen(),
  setSidebarExpanded: VOID_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT,
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
