import type { operations } from "./gbif";

export type PlantSearchFiltersNormalized = Omit<
  Required<operations["searchOccurrence"]["parameters"]>["query"],
  "limit"
>;
