import { useSearch } from "@tanstack/react-router";
import { PLANT_FORM_TITLES } from "components/plantSearch/plantSearchFormUtil";
import IconButton from "designSystem/iconButtons/IconButton";
import { capitalize } from "lodash";
import { RiPlantFill, RiPlantLine } from "react-icons/ri";

const PlantNameOpenButton = ({ onClick }: { onClick?: () => void }) => {
  const { plantName: plantNameParam } = useSearch({ strict: false });
  const plantName =
    plantNameParam &&
    ("commonName" in plantNameParam
      ? plantNameParam.commonName
      : plantNameParam.scientificName);
  const isActive = Boolean(plantName);

  return (
    <IconButton
      size="small"
      active={isActive}
      onClick={onClick}
      icon={isActive ? <RiPlantFill /> : <RiPlantLine />}
    >
      <span className="max-lg:hidden">
        {isActive ? capitalize(plantName!) : PLANT_FORM_TITLES["plant-name"]}
      </span>
    </IconButton>
  );
};

export default PlantNameOpenButton;
