import { createFileRoute } from "@tanstack/react-router";
import { SearchRecord } from "generated/graphql/graphql";
import SearchArchive from "pages/SearchArchive";

type SearchArchiveParams = {
  filter?: Record<keyof SearchRecord, boolean>; // TODO
  sortField?: string;
  sortDir?: -1 | 1;

  page?: number;
  lastOpened?: string;
};

export const Route = createFileRoute("/archive")({
  component: SearchArchive,
  validateSearch: (
    params: Record<string, string>,
  ): SearchArchiveParams | null => {
    if (typeof params.lastOpened === "string") {
      return { lastOpened: params.lastOpened };
    }
    return null;
  },
});
