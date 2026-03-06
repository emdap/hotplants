import {
  PlantSearchQueriesReturnType,
  PlantSearchQueryStatus,
} from "hooks/usePlantSearchQueries";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { PlantSearchParams } from "util/customSchemaTypes";
import {
  isSmallScreen,
  VOID_FUNCTION,
  VOID_PROMISE_FUNCTION,
} from "util/generalUtil";

type SearchFormTab = "location" | "filters";
type SearchFormState = { tab: SearchFormTab; isOpen: boolean };
export const DEFAULT_SEARCH_FORM_STATE = (): SearchFormState => ({
  tab: "location",
  isOpen: !isSmallScreen(),
});

export type PlantSearchContextType = {
  hasCurrentResults: boolean;

  isInfiniteScroll: boolean;
  setIsInfiniteScroll: (enabled: boolean) => void;

  searchParams: PlantSearchParams | null;
  searchParamsDraft: Partial<PlantSearchParams> | null;
  validatedSearchParamsDraft: PlantSearchParams | null;

  updateSearchParamsDraft: (locationParams: Partial<PlantSearchParams>) => void;
  applySearchParams: (params?: Partial<PlantSearchParams>) => void;

  searchStatus: PlantSearchQueryStatus;
  fetchMorePlants: () => Promise<unknown>;

  searchFormState: SearchFormState;
  setSearchFormState: Dispatch<SetStateAction<SearchFormState>>;

  scrollToResults: () => void;
} & Pick<
  PlantSearchQueriesReturnType,
  "searchRecordQuery" | "plantSearchQuery"
>;

const DEFAULT_PLANT_SEARCH_CONTEXT: PlantSearchContextType = {
  hasCurrentResults: false,

  isInfiniteScroll: !isSmallScreen(),
  setIsInfiniteScroll: VOID_FUNCTION,

  searchParams: null,
  searchParamsDraft: null,
  validatedSearchParamsDraft: null,

  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as PlantSearchQueriesReturnType["searchRecordQuery"],
  plantSearchQuery: {} as PlantSearchQueriesReturnType["plantSearchQuery"],
  fetchMorePlants: VOID_PROMISE_FUNCTION,

  searchFormState: DEFAULT_SEARCH_FORM_STATE(),
  setSearchFormState: VOID_FUNCTION,

  scrollToResults: VOID_FUNCTION,
};

export const PlantSearchContext = createContext<PlantSearchContextType>(
  DEFAULT_PLANT_SEARCH_CONTEXT,
);

export const usePlantSearchContext = () => useContext(PlantSearchContext);
