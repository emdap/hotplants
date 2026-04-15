import { useSearch } from "@tanstack/react-router";
import { OpenPlantFormProps } from "components/plantDataControls/plantSearchFormUtil";
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
  const hasChanges = !isEqual(searchParamsDraft?.location, location);

  return (
    <PlantFormOpenButton
      active={isActive}
      icon={isActive ? <FaGlobe /> : <CiGlobe />}
      hasChanges={hasChanges}
      {...props}
    >
      <span>
        {hasChanges && !searchParamsDraft.location
          ? "None"
          : isActive
            ? locationName
            : "Location"}
      </span>
    </PlantFormOpenButton>
  );
};

export default PlantLocationOpenButton;
