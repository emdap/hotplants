import { useSearch } from "@tanstack/react-router";
import FilterButton from "designSystem/iconButtons/FilterButton";
import pluralize from "pluralize";
import EntityFormOpenButton from "../EntityFormOpenButton";
import { OpenEntityFormProps } from "../entityFormUtil";

// TODO: pick animal/plant filters based on entityType
const EntityFilterOpenButton = (props: OpenEntityFormProps) => {
  const { plantFilter } = useSearch({ strict: false });
  const appliedFilters = plantFilter ? Object.keys(plantFilter).length : 0;
  const isActive = Boolean(appliedFilters);

  return (
    <EntityFormOpenButton
      active={isActive}
      CustomIconButton={FilterButton}
      {...props}
    >
      <span>
        {isActive ? `${pluralize("filter", appliedFilters, true)}` : "Filter"}
      </span>
    </EntityFormOpenButton>
  );
};

export default EntityFilterOpenButton;
