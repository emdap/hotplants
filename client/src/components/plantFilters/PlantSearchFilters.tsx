import { PlantDataInput } from "generated/graphql/graphql";
import { Dispatch, SetStateAction } from "react";
import FilterInputField from "./FilterInputField";
import { FILTER_DICT } from "./filterFixtures";

const ENABLED_FILTERS = Object.values(FILTER_DICT);

const PlantSearchFilters = ({
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
          <FilterInputField
            key={index}
            filterInput={filterInput}
            value={plantFilters[plantDataKey]}
            onChange={(value) =>
              setPlantFilters((prev) => ({ ...prev, [plantDataKey]: value }))
            }
          />
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

export default PlantSearchFilters;
