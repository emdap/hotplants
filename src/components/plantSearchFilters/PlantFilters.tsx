import classNames from "classnames";
import { PlantDataInput } from "generated/graphql/graphql";
import { Dispatch, SetStateAction } from "react";
import { ENABLED_FILTERS } from "./filterFixtures";
import FilterInputField from "./FilterInputField";

const PlantFilters = ({
  plantFilters,
  setPlantFilters,
}: {
  plantFilters: PlantDataInput;
  setPlantFilters: Dispatch<SetStateAction<PlantDataInput>>;
}) => {
  // const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // const filterList = useMemo(
  //   () =>
  //     showAdvancedFilters
  //       ? ENABLED_FILTERS
  //       : ENABLED_FILTERS.filter(({ advancedFilter }) => !advancedFilter),
  //   [showAdvancedFilters]
  // );

  return (
    <div className="space-y-4 max-w-full overflow-auto">
      {ENABLED_FILTERS.map((filterInput, index) => {
        const { plantDataKey } = filterInput;

        return (
          <div
            className={classNames(
              "form-item",
              ["checkbox", "range"].includes(filterInput.inputType) &&
                "flex-row items-center gap-4"
            )}
            key={index}
          >
            {/* {index === FIRST_ADVANCED_FILTER_INDEX && (
              <hr className="opacity-10 my-4" />
            )} */}
            <FilterInputField
              filterInput={filterInput}
              value={plantFilters[plantDataKey]}
              onChange={(value) =>
                setPlantFilters((prev) => ({ ...prev, [plantDataKey]: value }))
              }
            />
          </div>
        );
      })}

      {/* <Button
        variant="primary"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        {showAdvancedFilters
          ? "Hide Advanced Filters"
          : "Show Advanced Filters"}
      </Button> */}
    </div>
  );
};

export default PlantFilters;
