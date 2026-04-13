import type * as Hotplants from "generated/schemas/hotplants";
import { paths } from "generated/schemas/hotplants";
import createClient from "openapi-fetch";

export const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_PROXY_SERVER_URL}/api`,
  credentials: "include",
});

export type PlantSearchParams = Omit<
  Hotplants.components["schemas"]["EntitySearchParams"],
  "entityType"
>;

export type PlantArrayValues =
  // TODO: Omitted habitats from BE as well, not scraping good values
  Omit<Hotplants.components["schemas"]["PlantArrayValuesDocument"], "habitats">;

export type PlantLocationParams = Required<PlantSearchParams>["location"];
export type PlantNameParam = Required<PlantSearchParams>["entityName"];

export type OptionalSearchParamKey = "commonName" | "scientificName";
