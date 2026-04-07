import { useSearch } from "@tanstack/react-router";
import FilterButton from "designSystem/iconButtons/FilterButton";
import pluralize from "pluralize";
import PlantFormOpenButton from "../PlantFormOpenButton";
import { OpenPlantFormProps } from "../plantSearchFormUtil";

const PlantFilterOpenButton = (props: OpenPlantFormProps) => {
  const { plantFilter } = useSearch({ strict: false });
  const appliedFilters = plantFilter ? Object.keys(plantFilter).length : 0;
  const isActive = Boolean(appliedFilters);

  return (
    <PlantFormOpenButton
      active={isActive}
      CustomIconButton={FilterButton}
      {...props}
    >
      <span>
        {isActive ? `${pluralize("filter", appliedFilters, true)}` : "Filter"}
      </span>
    </PlantFormOpenButton>
  );
};

export default PlantFilterOpenButton;
