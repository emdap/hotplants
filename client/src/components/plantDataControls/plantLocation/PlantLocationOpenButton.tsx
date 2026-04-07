import { useSearch } from "@tanstack/react-router";
import {
  OpenPlantFormProps,
  PLANT_FORM_TITLES,
} from "components/plantDataControls/plantSearchFormUtil";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import { isEqual } from "lodash";
import { CiGlobe } from "react-icons/ci";
import { FaGlobe } from "react-icons/fa";
import { locationDisplay } from "util/locationUtil";
import PlantFormOpenButton from "../PlantFormOpenButton";

const PlantLocationOpenButton = (props: OpenPlantFormProps) => {
  const { searchParamsDraft } = useSearchParamsContext();
  const { location } = useSearch({ strict: false });

  const locationName = location ? locationDisplay(location, true).title : null;
  const isActive = Boolean(locationName);

  return (
    <PlantFormOpenButton
      active={isActive}
      icon={isActive ? <FaGlobe /> : <CiGlobe />}
      hasChanges={!isEqual(searchParamsDraft?.location, location)}
      {...props}
    >
      <span>{isActive ? locationName : PLANT_FORM_TITLES.location}</span>
    </PlantFormOpenButton>
  );
};

export default PlantLocationOpenButton;
