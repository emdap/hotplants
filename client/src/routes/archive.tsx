import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import SearchArchive from "pages/SearchArchive";
import { validateSearchArchiveParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/archive")({
  component: SearchArchive,
  search: { middlewares: [retainSearchParams(true)] },
  validateSearch: validateSearchArchiveParams,
});
