import {
  getPlantFormTitle,
  OpenPlantFormProps,
} from "components/plantDataControls/plantSearchFormUtil";
import { PlantNameParam } from "config/hotplantsConfig";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import { capitalize } from "lodash";
import {
  RiBearSmileFill,
  RiBearSmileLine,
  RiPlantFill,
  RiPlantLine,
} from "react-icons/ri";
import PlantFormOpenButton from "../PlantFormOpenButton";

const getPlantName = (param?: PlantNameParam) =>
  param && ("commonName" in param ? param.commonName : param.scientificName);

const ICON_DICT = {
  plant: {
    active: <RiPlantFill />,
    inactive: <RiPlantLine />,
  },
  animal: {
    active: <RiBearSmileFill />,
    inactive: <RiBearSmileLine />,
  },
};

const PlantNameOpenButton = (props: OpenPlantFormProps) => {
  const {
    searchParams: { entityName: plantNameParam, entityType },
    searchParamsDraft,
  } = useSearchParamsContext();

  const plantNameDraft = getPlantName(searchParamsDraft?.entityName);
  const appliedPlantName = getPlantName(plantNameParam);
  const isActive = Boolean(appliedPlantName);

  return (
    <PlantFormOpenButton
      active={isActive}
      hasChanges={
        plantNameDraft?.toLowerCase() !== appliedPlantName?.toLowerCase()
      }
      icon={ICON_DICT[entityType][isActive ? "active" : "inactive"]}
      {...props}
    >
      <span>
        {plantNameDraft
          ? capitalize(plantNameDraft)
          : appliedPlantName
            ? "None"
            : getPlantFormTitle("plant-name", entityType)}
      </span>
    </PlantFormOpenButton>
  );
};

export default PlantNameOpenButton;
