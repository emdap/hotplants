import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import SearchArchive from "pages/SearchArchive";
import { validateSearchArchiveParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/search-archive")({
  component: SearchArchive,
  search: {
    middlewares: [
      ({ search: incomingSearch, next }) => {
        // Strip dangling params from plant-search
        const {
          search: _search,
          filter,
          ...rest
        } = incomingSearch as Record<string, unknown>;

        if (Array.isArray(filter)) {
          return next({ filter, ...rest });
        }

        return next(rest);
      },
      retainSearchParams(true),
    ],
  },
  validateSearch: validateSearchArchiveParams,
});
