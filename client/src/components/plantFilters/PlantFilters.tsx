import { PlantSearchContextType } from "contexts/plantSearch/PlantSearchContext";
import { hotplantsClient } from "hooks/usePlantSearchQueries";
import { useReactQuery } from "hooks/useQuery";
import { useMemo } from "react";
import { toast } from "sonner";
import FilterInputField from "./FilterInputField";
import {
  constructDynamicFilters,
  getSortedFilterEntries,
  STATIC_FILTER_DICT,
} from "./plantFilterUtil";

// TODO: Decide if auto-apply or 'apply' button is best
const PlantFilters = ({
  plantFilter,
  applyPlantFilter,
}: Pick<PlantSearchContextType, "plantFilter" | "applyPlantFilter">) => {
  const filterValuesQuery = useReactQuery({
    queryKey: ["plant-filters"],
    refetchOnWindowFocus: false,
    initialData: {},
    queryFn: async () => {
      try {
        const { data } = await hotplantsClient.GET("/plants/filterValues");
        return data ?? {};
      } catch (error) {
        console.error(error);
        toast.error("Error getting possible filter values from server.");
      }
    },
  });

  const sortedFilters = useMemo(() => {
    const dynamicFilters =
      (filterValuesQuery.data &&
        constructDynamicFilters(filterValuesQuery.data)) ??
      {};

    return getSortedFilterEntries({ ...dynamicFilters, ...STATIC_FILTER_DICT });
  }, [filterValuesQuery.data]);

  return (
    <div>
      {sortedFilters.map(([plantDataKey, filterInput]) => {
        return (
          <FilterInputField
            key={plantDataKey}
            filterInput={filterInput}
            value={plantFilter[plantDataKey]}
            onChange={(value) =>
              applyPlantFilter({ ...plantFilter, [plantDataKey]: value })
            }
          />
        );
      })}
    </div>
  );
};

export default PlantFilters;
