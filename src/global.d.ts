declare module "wkt" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export const stringify = (geoJson: import("geojson").GeoJsonObject) => string;
}

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_SERVER: string;
  readonly VITE_HOTPLANTS_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
