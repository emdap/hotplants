import { useSearch } from "@tanstack/react-router";
import {
  OpenPlantFormProps,
  PLANT_FORM_TITLES,
} from "components/plantDataControls/plantSearchFormUtil";
import { PlantNameParam } from "config/hotplantsConfig";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import { capitalize } from "lodash";
import { RiPlantFill, RiPlantLine } from "react-icons/ri";
import PlantFormOpenButton from "../PlantFormOpenButton";

const getPlantName = (param?: PlantNameParam) =>
  param && ("commonName" in param ? param.commonName : param.scientificName);

const PlantNameOpenButton = (props: OpenPlantFormProps) => {
  const { searchParamsDraft } = useSearchParamsContext();
  const { entityName: plantNameParam } = useSearch({ strict: false });

  const plantNameDraft = getPlantName(searchParamsDraft?.entityName);
  const appliedPlantName = getPlantName(plantNameParam);
  const isActive = Boolean(appliedPlantName);

  return (
    <PlantFormOpenButton
      active={isActive}
      hasChanges={
        plantNameDraft?.toLowerCase() !== appliedPlantName?.toLowerCase()
      }
      icon={isActive ? <RiPlantFill /> : <RiPlantLine />}
      {...props}
    >
      <span>
        {plantNameDraft
          ? capitalize(plantNameDraft)
          : appliedPlantName
            ? "None"
            : PLANT_FORM_TITLES["plant-name"]}
      </span>
    </PlantFormOpenButton>
  );
};

export default PlantNameOpenButton;
