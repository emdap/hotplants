import { useNavigate, useSearch } from "@tanstack/react-router";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import StyledPopover from "designSystem/StyledPopover";
import FilterButton from "designSystem/iconButtons/FilterButton";
import { hotplantsClient } from "hooks/usePlantSearchQueries";
import { useReactQuery } from "hooks/useQuery";
import { useMemo } from "react";
import { toast } from "sonner";
import { PlantDataFilter } from "util/customSchemaTypes";
import FilterInputField from "./FilterInputField";
import {
  constructDynamicFilters,
  getSortedFilterEntries,
  STATIC_FILTER_DICT,
} from "./plantFilterUtil";

export type PlantFilterProps = {
  plantFilter?: PlantDataFilter;
  applyPlantFilter: (filter?: PlantDataFilter) => void;
};

const PlantFilters = ({ asPopover }: { asPopover?: boolean }) => {
  const navigate = useNavigate();
  const { plantFilter } = useSearch({ strict: false });

  const clearFilter = () =>
    navigate({
      to: ".",
      search: ({ plantFilter: _prevFilter, ...prev }) => prev,
    });

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

  const filterCard = (
    <Card>
      {sortedFilters.map(([plantDataKey, filterInput]) => {
        return (
          filterInput && (
            <FilterInputField
              key={plantDataKey}
              filterInput={filterInput}
              value={plantFilter?.[plantDataKey]}
              onChange={(value) =>
                applyFilter({ ...plantFilter, [plantDataKey]: value })
              }
            />
          )
        );
      })}
      <Button onClick={clearFilter}>Clear filters</Button>
    </Card>
  );

  return asPopover ? (
    <StyledPopover
      anchor="bottom start"
      button={<FilterButton size="small" active={Boolean(plantFilter)} />}
    >
      {filterCard}
    </StyledPopover>
  ) : (
    filterCard
  );
};

export default PlantFilters;
