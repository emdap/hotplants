import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import SearchHistory from "pages/SearchHistory";
import {
  DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS,
  validateSearchHistoryParams,
} from "util/routeParamsUtil";

export const Route = createFileRoute("/search-history")({
  component: SearchHistory,
  search: {
    middlewares: [stripSearchParams(DEFAULT_SEARCH_HISTORY_ROUTE_PARAMS)],
  },
  validateSearch: validateSearchHistoryParams,
});
