import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import SearchArchive from "pages/SearchArchive";
import { validateSearchArchiveParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/search-archive")({
  component: SearchArchive,
  search: {
    middlewares: [
      ({ search: incomingSearch, next }) => {
        // Strip dangling param from plant-search
        const { search: _search, ...rest } = incomingSearch as Record<
          string,
          unknown
        >;
        return next(rest);
      },
      retainSearchParams(true),
    ],
  },
  validateSearch: validateSearchArchiveParams,
});
