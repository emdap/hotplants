import { useSearch } from "@tanstack/react-router";
import FilterButton from "designSystem/iconButtons/FilterButton";
import pluralize from "pluralize";

const PlantFiltersButton = ({ onClick }: { onClick?: () => void }) => {
  const { plantFilter } = useSearch({ strict: false });
  const appliedFilters = plantFilter ? Object.keys(plantFilter).length : 0;
  const isActive = Boolean(appliedFilters);

  return (
    <FilterButton size="small" active={isActive} onClick={onClick}>
      <span className="max-lg:hidden">
        {isActive ? `${pluralize("filter", appliedFilters, true)}` : "Filter"}
      </span>
    </FilterButton>
  );
};

export default PlantFiltersButton;
