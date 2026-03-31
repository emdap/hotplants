import { useSearch } from "@tanstack/react-router";
import { PLANT_FORM_TITLES } from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import IconButton from "designSystem/iconButtons/IconButton";
import { capitalize } from "lodash";
import { RiPlantFill, RiPlantLine } from "react-icons/ri";
import { PlantNameParam } from "util/customSchemaTypes";

const getPlantName = (param?: PlantNameParam) =>
  param && ("commonName" in param ? param.commonName : param.scientificName);

const PlantNameOpenButton = ({ onClick }: { onClick?: () => void }) => {
  const { searchParamsDraft } = usePlantSearchContext();
  const { plantName: plantNameParam } = useSearch({ strict: false });

  const plantNameDraft = getPlantName(searchParamsDraft?.plantName);
  const appliedPlantName = getPlantName(plantNameParam);
  const isActive = Boolean(appliedPlantName);

  return (
    <IconButton
      size="small"
      active={isActive}
      className={
        plantNameDraft?.toLowerCase() !== appliedPlantName?.toLowerCase()
          ? "bg-accent/30!"
          : undefined
      }
      onClick={onClick}
      icon={isActive ? <RiPlantFill /> : <RiPlantLine />}
    >
      <span>
        {plantNameDraft
          ? capitalize(plantNameDraft)
          : appliedPlantName
            ? "None"
            : PLANT_FORM_TITLES["plant-name"]}
      </span>
    </IconButton>
  );
};

export default PlantNameOpenButton;
