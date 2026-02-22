import { createContext, useContext } from "react";

type PaginationContextType = {
  page: number;
  pageSize: number;
  lastPage: number;
  totalItems: number;
};

const DEFAULT_PAGINATION_CONTEXT: PaginationContextType = {
  page: 0,
  pageSize: 0,
  lastPage: 0,
  totalItems: 0,
};

export const PaginationContext = createContext<PaginationContextType>(
  DEFAULT_PAGINATION_CONTEXT,
);
export const usePaginationContext = () => useContext(PaginationContext);
