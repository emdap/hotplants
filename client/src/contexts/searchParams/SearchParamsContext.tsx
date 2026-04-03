import { PlantSearchParams } from "config/hotplantsConfig";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export type SearchParamsContextType = {
  searchParams: PlantSearchParams;
  searchParamsDraft: Partial<PlantSearchParams> | null;
  updateSearchParamsDraft: (partialParams: Partial<PlantSearchParams>) => void;
  applySearchParams: (params: Partial<PlantSearchParams>) => void;

  isPrefilledSearch: boolean;
  setIsPrefilledSearch: Dispatch<SetStateAction<boolean>>;
};

const DEFAULT_SEARCH_PARAMS_CONTEXT: SearchParamsContextType = {
  searchParams: {},
  searchParamsDraft: null,
  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,

  isPrefilledSearch: false,
  setIsPrefilledSearch: VOID_FUNCTION,
};

export const SearchParamsContext = createContext<SearchParamsContextType>(
  DEFAULT_SEARCH_PARAMS_CONTEXT,
);

export const useSearchParamsContext = () => useContext(SearchParamsContext);
