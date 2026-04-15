import { EntitySearchParams } from "config/hotplantsConfig";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export type SearchParamsContextType = {
  searchParamsDraft: Partial<EntitySearchParams>;
  updateSearchParamsDraft: (partialParams: Partial<EntitySearchParams>) => void;
  applySearchParams: (params: Partial<EntitySearchParams>) => void;
  resetSearchParamsDraft: () => void;

  isPrefilledSearch: boolean;
  setIsPrefilledSearch: Dispatch<SetStateAction<boolean>>;
} & EntitySearchParams;

const DEFAULT_SEARCH_PARAMS_CONTEXT: SearchParamsContextType = {
  entityType: "plant",
  searchParamsDraft: {},
  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,
  resetSearchParamsDraft: VOID_FUNCTION,

  isPrefilledSearch: false,
  setIsPrefilledSearch: VOID_FUNCTION,
};

export const SearchParamsContext = createContext<SearchParamsContextType>(
  DEFAULT_SEARCH_PARAMS_CONTEXT,
);

export const useSearchParamsContext = () => useContext(SearchParamsContext);
