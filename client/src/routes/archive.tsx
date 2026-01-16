import { createFileRoute } from "@tanstack/react-router";
import SearchArchive from "pages/SearchArchive";

export const Route = createFileRoute("/archive")({
  component: SearchArchive,
});
