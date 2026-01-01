import { createFileRoute } from "@tanstack/react-router";
import PageTitle from "designSystem/PageTitle";

const BrowsePlantSearches = () => {
  console.log("here");
  return (
    <main className="page-wrapper">
      <PageTitle>Previous Searches</PageTitle>
      Coming soon :)
    </main>
  );
};

export const Route = createFileRoute("/search_/browse")({
  component: BrowsePlantSearches,
});
