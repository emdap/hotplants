import { FilterInputConfig } from "components/dataControls/filterUtil";
import { OptionalSearchParamKey } from "config/hotplantsConfig";
import { SearchFormTab } from "contexts/entitySearch/EntitySearchContext";
import { EntityType } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import pluralize from "pluralize";

export type EntityFormProps = {
  onSubmit?: () => void;
  hideFooter?: boolean;
} & (
  | { renderMode: "card"; onClose?: () => void }
  | { renderMode: "modal" | "popover"; onClose: () => void }
);

export type OpenEntityFormProps = {
  isOpen?: boolean;
  hasChanges?: boolean;
  onClick?: () => void;
};

export const ENTITY_NAME_FIELDS: FilterInputConfig<
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

export const DEFAULT_ENTITY_NAME_FIELDS = {
  commonName: undefined,
  scientificName: undefined,
};

export const getFormTitle = (
  tabName: SearchFormTab,
  entityType: EntityType,
) => {
  if (tabName === "location") {
    return "Location";
  }
  if (tabName === "filters") {
    return `Filter ${pluralize(entityType)}`;
  }
  return `${capitalize(entityType)} name`;
};
