import {
  getFormTitle,
  OpenEntityFormProps,
} from "components/entityForms/entityFormUtil";
import { PlantNameParam } from "config/hotplantsConfig";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import { EntityType } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import { ReactNode } from "react";
import {
  RiBearSmileFill,
  RiBearSmileLine,
  RiPlantFill,
  RiPlantLine,
} from "react-icons/ri";
import EntityFormOpenButton from "../EntityFormOpenButton";

const getEntityName = (param?: PlantNameParam) =>
  param && ("commonName" in param ? param.commonName : param.scientificName);

const ICON_DICT: Record<
  EntityType,
  Record<"active" | "inactive", ReactNode>
> = {
  plant: {
    active: <RiPlantFill />,
    inactive: <RiPlantLine />,
  },
  animal: {
    active: <RiBearSmileFill />,
    inactive: <RiBearSmileLine />,
  },
};

const EntityNameOpenButton = (props: OpenEntityFormProps) => {
  const {
    searchParams: { entityName: nameParam, entityType },
    searchParamsDraft,
  } = useSearchParamsContext();

  const nameDraft = getEntityName(searchParamsDraft?.entityName);
  const appliedName = getEntityName(nameParam);
  const isActive = Boolean(appliedName);

  return (
    <EntityFormOpenButton
      active={isActive}
      hasChanges={nameDraft?.toLowerCase() !== appliedName?.toLowerCase()}
      icon={ICON_DICT[entityType][isActive ? "active" : "inactive"]}
      {...props}
    >
      <span>
        {nameDraft
          ? capitalize(nameDraft)
          : appliedName
            ? "None"
            : getFormTitle("plant-name", entityType)}
      </span>
    </EntityFormOpenButton>
  );
};

export default EntityNameOpenButton;
