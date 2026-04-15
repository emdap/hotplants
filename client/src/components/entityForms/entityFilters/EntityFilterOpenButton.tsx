import { useSearch } from "@tanstack/react-router";
import FilterButton from "designSystem/iconButtons/FilterButton";
import pluralize from "pluralize";
import EntityFormOpenButton from "../EntityFormOpenButton";
import { OpenEntityFormProps } from "../entityFormUtil";

const EntityFilterOpenButton = (props: OpenEntityFormProps) => {
  const { filter } = useSearch({ strict: false });
  const appliedFilters = filter ? Object.keys(filter).length : 0;
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
