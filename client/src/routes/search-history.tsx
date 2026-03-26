import { createFileRoute } from "@tanstack/react-router";
import SearchHistory from "pages/SearchHistory";
import { validateSearchHistoryParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/search-history")({
  component: SearchHistory,
  validateSearch: validateSearchHistoryParams,
});
