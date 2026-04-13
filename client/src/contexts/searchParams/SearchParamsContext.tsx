import { EntitySearchParams } from "config/hotplantsConfig";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export type SearchParamsContextType = {
  searchParams: EntitySearchParams;
  searchParamsDraft: Partial<EntitySearchParams>;
  updateSearchParamsDraft: (partialParams: Partial<EntitySearchParams>) => void;
  applySearchParams: (params: Partial<EntitySearchParams>) => void;

  isPrefilledSearch: boolean;
  setIsPrefilledSearch: Dispatch<SetStateAction<boolean>>;
};

const DEFAULT_SEARCH_PARAMS_CONTEXT: SearchParamsContextType = {
  searchParams: { entityType: "plant" },
  searchParamsDraft: {},
  updateSearchParamsDraft: VOID_FUNCTION,
  applySearchParams: VOID_FUNCTION,

  isPrefilledSearch: false,
  setIsPrefilledSearch: VOID_FUNCTION,
};

export const SearchParamsContext = createContext<SearchParamsContextType>(
  DEFAULT_SEARCH_PARAMS_CONTEXT,
);

export const useSearchParamsContext = () => useContext(SearchParamsContext);
