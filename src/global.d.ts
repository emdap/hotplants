declare module "wkt" {
  export const stringify = (geoJson: import("geojson").GeoJsonObject) => string;
}

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_SERVER: string;
  readonly VITE_HOTPLANTS_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
