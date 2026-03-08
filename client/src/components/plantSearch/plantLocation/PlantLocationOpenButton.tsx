import { useSearch } from "@tanstack/react-router";
import { PLANT_FORM_TITLES } from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import IconButton from "designSystem/iconButtons/IconButton";
import { isEqual } from "lodash";
import { CiGlobe } from "react-icons/ci";
import { FaGlobe } from "react-icons/fa";
import { locationDisplay } from "util/locationUtil";

const PlantLocationOpenButton = ({ onClick }: { onClick?: () => void }) => {
  const { searchParamsDraft } = usePlantSearchContext();
  const { location } = useSearch({ strict: false });

  const locationName = location ? locationDisplay(location, true).title : null;
  const isActive = Boolean(locationName);

  return (
    <IconButton
      size="small"
      active={isActive}
      onClick={onClick}
      icon={isActive ? <FaGlobe /> : <CiGlobe />}
      className={
        isEqual(searchParamsDraft?.location, location)
          ? undefined
          : "bg-accent/30!"
      }
    >
      <span className="max-lg:hidden">
        {isActive ? locationName : PLANT_FORM_TITLES.location}
      </span>
    </IconButton>
  );
};

export default PlantLocationOpenButton;
