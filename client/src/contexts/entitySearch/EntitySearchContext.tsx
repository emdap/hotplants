import {
  EntitySearchQueriesReturnType,
  SearchQueryStatus,
} from "hooks/useEntitySearchQueries";
import { createContext, Dispatch, SetStateAction, use } from "react";
import {
  isSmallScreen,
  VOID_FUNCTION,
  VOID_PROMISE_FUNCTION,
} from "util/generalUtil";
import { DEFAULT_SEARCH_FORM_STATE } from "./defaultEntitySearchFormState";

export type SearchFormTab = "location" | "entity-name" | "filters";
export type SearchFormState = { tab: SearchFormTab; isOpen: boolean };

export type EntitySearchContextType = {
  hasCurrentResults: boolean;

  isInfiniteScroll: boolean;
  setIsInfiniteScroll: (enabled: boolean) => void;

  searchStatus: SearchQueryStatus;
  fetchMore: () => Promise<unknown>;

  searchFormState: SearchFormState;
  setSearchFormState: Dispatch<SetStateAction<SearchFormState>>;

  getResultsContainer: () => HTMLDivElement | null | void;
} & Pick<
  EntitySearchQueriesReturnType,
  "searchRecordQuery" | "entitySearchQuery"
>;

const DEFAULT_ENTITY_SEARCH_CONTEXT: EntitySearchContextType = {
  hasCurrentResults: false,

  isInfiniteScroll: !isSmallScreen(),
  setIsInfiniteScroll: VOID_FUNCTION,

  searchStatus: "READY",
  searchRecordQuery: {} as EntitySearchQueriesReturnType["searchRecordQuery"],
  entitySearchQuery: {} as EntitySearchQueriesReturnType["entitySearchQuery"],
  fetchMore: VOID_PROMISE_FUNCTION,

  searchFormState: DEFAULT_SEARCH_FORM_STATE(),
  setSearchFormState: VOID_FUNCTION,

  getResultsContainer: VOID_FUNCTION,
};

export const EntitySearchContext = createContext<EntitySearchContextType>(
  DEFAULT_ENTITY_SEARCH_CONTEXT,
);

export const useEntitySearchContext = () => use(EntitySearchContext);
