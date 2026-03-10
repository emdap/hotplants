declare module "wkt" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export const stringify = (geoJson: import("geojson").GeoJsonObject) => string;
}
interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type PickRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
