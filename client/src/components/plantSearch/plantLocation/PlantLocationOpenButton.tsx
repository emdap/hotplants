import { useSearch } from "@tanstack/react-router";
import { PLANT_FORM_TITLES } from "components/plantSearch/plantSearchFormUtil";
import IconButton from "designSystem/iconButtons/IconButton";
import { CiGlobe } from "react-icons/ci";
import { FaGlobe } from "react-icons/fa";
import { locationDisplay } from "util/locationUtil";

const PlantLocationOpenButton = ({ onClick }: { onClick?: () => void }) => {
  const { search } = useSearch({ strict: false });
  const locationName = search ? locationDisplay(search, true).title : null;
  const isActive = Boolean(locationName);

  return (
    <IconButton
      size="small"
      active={isActive}
      onClick={onClick}
      icon={isActive ? <FaGlobe /> : <CiGlobe />}
    >
      <span className="max-lg:hidden">
        {isActive ? locationName : PLANT_FORM_TITLES.location}
      </span>
    </IconButton>
  );
};

export default PlantLocationOpenButton;
