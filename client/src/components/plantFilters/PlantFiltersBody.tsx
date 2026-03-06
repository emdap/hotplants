import { useNavigate, useSearch } from "@tanstack/react-router";
import { hotplantsClient } from "hooks/usePlantSearchQueries";
import { useReactQuery } from "hooks/useQuery";
import { ReactNode, useMemo } from "react";
import { toast } from "sonner";
import { PlantDataFilter } from "util/customSchemaTypes";
import FilterInputField from "./FilterInputField";
import {
  constructDynamicFilters,
  getSortedFilterEntries,
  STATIC_FILTER_DICT,
} from "./plantFilterUtil";

const PlantFiltersBody = ({
  title,
  omitTitle,
}: {
  title?: ReactNode;
  omitTitle?: boolean;
}) => {
  const navigate = useNavigate();
  const { plantFilter } = useSearch({ strict: false });

  const applyFilter = (newFilter?: PlantDataFilter) => {
    {
      const filterHasData = Boolean(
        newFilter &&
        Object.values(newFilter).filter((val) => val !== undefined).length,
      );

      navigate({
        to: ".",
        search: ({ plantFilter: _prevFilter, ...prev }) => ({
          ...prev,
          ...(filterHasData && { page: 1, plantFilter: newFilter }),
        }),
        replace: true,
      });
    }
  };

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
    <div className="grow space-y-4 pt-2 pr-2 overflow-auto">
      {!omitTitle &&
        (title || <h4 className="font-semibold">Filter plants</h4>)}
      {sortedFilters.map(
        ([plantDataKey, filterInput]) =>
          filterInput && (
            <FilterInputField
              key={plantDataKey}
              filterInput={filterInput}
              value={plantFilter?.[plantDataKey]}
              onChange={(value) =>
                applyFilter({ ...plantFilter, [plantDataKey]: value })
              }
            />
          ),
      )}
    </div>
  );
};

export default PlantFiltersBody;
