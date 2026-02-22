import { createFileRoute } from "@tanstack/react-router";
import SearchArchive from "pages/SearchArchive";
import { validateSearchArchiveParams } from "util/routeParamsUtil";

export const Route = createFileRoute("/search-archive")({
  component: SearchArchive,
  validateSearch: validateSearchArchiveParams,
});
