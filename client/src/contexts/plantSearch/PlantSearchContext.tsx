import {
  PlantSearchQueriesReturnType,
  PlantSearchQueryStatus,
} from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  isSmallScreen,
  VOID_FUNCTION,
  VOID_PROMISE_FUNCTION,
} from "util/generalUtil";

export type SearchFormTab = "location" | "plant-name" | "filters";
type SearchFormState = { tab: SearchFormTab; isOpen: boolean };
export const DEFAULT_SEARCH_FORM_STATE = (): SearchFormState => ({
  tab: "location",
  isOpen: !isSmallScreen(),
});

export type PlantSearchContextType = {
  hasCurrentResults: boolean;

  isInfiniteScroll: boolean;
  setIsInfiniteScroll: (enabled: boolean) => void;

  searchStatus: PlantSearchQueryStatus;
  fetchMorePlants: () => Promise<unknown>;

  searchFormState: SearchFormState;
  setSearchFormState: Dispatch<SetStateAction<SearchFormState>>;

  getResultsContainer: () => HTMLDivElement | null | void;
} & Pick<
  PlantSearchQueriesReturnType,
  "searchRecordQuery" | "plantSearchQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,

  isInfiniteScroll: !isSmallScreen(),
  setIsInfiniteScroll: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  plantSearchQuery: {} as PlantSearchQueriesReturnType["plantSearchQuery"],
  fetchMorePlants: VOID_PROMISE_FUNCTION,

  searchFormState: DEFAULT_SEARCH_FORM_STATE(),
  setSearchFormState: VOID_FUNCTION,

  getResultsContainer: VOID_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT,
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
