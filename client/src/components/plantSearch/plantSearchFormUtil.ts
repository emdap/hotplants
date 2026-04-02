import { FilterInputConfig } from "components/dataControls/filterUtil";
import { OptionalSearchParamKey } from "config/hotplantsConfig";
import { SearchFormTab } from "contexts/plantSearch/PlantSearchContext";

export type PlantSearchFormProps = {
  renderMode: "card" | "modal" | "popover";
  onClose: () => void;
};

export const PLANT_NAME_FIELDS: FilterInputConfig<
  "text",
  OptionalSearchParamKey
>[] = [
  {
    dataKey: "commonName",
    label: "Common name",
    inputType: "text",
  },
  {
    dataKey: "scientificName",
    label: "Scientific name",
    inputType: "text",
  },
];

export const DEFAULT_PLANT_NAME_FIELDS = {
  commonName: undefined,
  scientificName: undefined,
};

export const PLANT_FORM_TITLES: Record<SearchFormTab, string> = {
  location: "Location",
  "plant-name": "Plant name",
  filters: "Filter plants",
};
