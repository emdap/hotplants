import { paths } from "generated/schemas/hotplants";
import createClient from "openapi-fetch";

export const hotplantsClient = createClient<paths>({
  baseUrl: `${import.meta.env.VITE_PROXY_SERVER_URL}/api`,
  credentials: "include",
});
