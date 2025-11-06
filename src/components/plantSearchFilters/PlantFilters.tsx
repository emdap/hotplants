import Button from "designSystem/Button";
import { useMemo, useState } from "react";
import { FILTERS, PlantDataFilter } from "./filterFixtures";
import FilterInputField from "./FilterInput";

const PlantFilters = ({
  plantFilters: _p,
  setPlantFilters: _pf,
}: {
  plantFilters?: PlantDataFilter;
  setPlantFilters?: (filters: PlantDataFilter) => void;
}) => {
  const [tempFilter, setTempFilter] = useState<PlantDataFilter>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filterList = useMemo(
    () =>
      showAdvancedFilters
        ? FILTERS.sort(([, { advancedFilter }]) => (advancedFilter ? 1 : -1))
        : FILTERS.filter(([, { advancedFilter }]) => !advancedFilter),
    [showAdvancedFilters]
  );

  return (
    <div>
      {filterList.map(([filterKey, filterInput]) => (
        <FilterInputField
          key={filterKey}
          {...{ filterKey, filterInput }}
          value={tempFilter[filterKey]}
          onChange={(value) =>
            setTempFilter((prev) => ({ ...prev, [filterKey]: value }))
          }
        />
      ))}

      <Button
        variant="primary"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        {showAdvancedFilters
          ? "Hide Advanced Filters"
          : "Show Advanced Filters"}
      </Button>
    </div>
  );
};

export default PlantFilters;
