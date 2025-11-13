import classNames from "classnames";
import Button from "designSystem/Button";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
    <div className="space-y-4 max-w-full overflow-auto">
      {filterList.map(([filterKey, filterInput], index) => (
        <div
          className={classNames(
            "form-item",
            ["checkbox", "range"].includes(filterInput.inputType) &&
              "flex-row items-center gap-4"
          )}
          key={index}
        >
          {index === FIRST_ADVANCED_FILTER_INDEX && (
            <hr className="opacity-10 my-4" />
          )}
          <label htmlFor={filterKey}>{filterInput.label}</label>
          <FilterInputField
            {...{ filterKey, filterInput }}
            value={plantFilters[filterKey]}
            onChange={(value) =>
              setPlantFilters((prev) => ({ ...prev, [filterKey]: value }))
            }
          />
        </div>
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
