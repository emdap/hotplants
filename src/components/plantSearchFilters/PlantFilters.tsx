import Button from "designSystem/Button";
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from "react";
import {
  FILTERS,
  FIRST_ADVANCED_FILTER_INDEX,
  PlantDataFilter,
} from "./filterFixtures";
import FilterInputField from "./FilterInput";

const PlantFilters = ({
  plantFilters,
  setPlantFilters,
}: {
  plantFilters: PlantDataFilter;
  setPlantFilters: Dispatch<SetStateAction<PlantDataFilter>>;
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filterList = useMemo(
    () =>
      showAdvancedFilters
        ? FILTERS
        : FILTERS.filter(([, { advancedFilter }]) => !advancedFilter),
    [showAdvancedFilters]
  );

  return (
    <div className="space-y-2 max-w-full overflow-auto">
      {filterList.map(([filterKey, filterInput], index) => (
        <Fragment key={filterKey}>
          {index === FIRST_ADVANCED_FILTER_INDEX && (
            <hr className="opacity-10 my-4" />
          )}
          <FilterInputField
            {...{ filterKey, filterInput }}
            value={plantFilters[filterKey]}
            onChange={(value) =>
              setPlantFilters((prev) => ({ ...prev, [filterKey]: value }))
            }
          />
        </Fragment>
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
