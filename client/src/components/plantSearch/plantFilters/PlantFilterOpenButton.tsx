import { useSearch } from "@tanstack/react-router";
import FilterButton from "designSystem/iconButtons/FilterButton";
import pluralize from "pluralize";
import { ButtonHTMLAttributes } from "react";

const PlantFilterOpenButton = ({
  onClick,
}: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">) => {
  const { plantFilter } = useSearch({ strict: false });
  const appliedFilters = plantFilter ? Object.keys(plantFilter).length : 0;
  const isActive = Boolean(appliedFilters);

  return (
    <FilterButton
      size="small"
      active={isActive}
      onClick={onClick}
      className="w-fit"
    >
      <span>
        {isActive ? `${pluralize("filter", appliedFilters, true)}` : "Filter"}
      </span>
    </FilterButton>
  );
};

export default PlantFilterOpenButton;
