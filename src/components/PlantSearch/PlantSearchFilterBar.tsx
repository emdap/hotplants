import Card from "designSystem/Card";
import type { PlantSearchFiltersNormalized } from "generated/schemas/gbif-custom-types";
import { useState } from "react";
import LocationSearchInput from "./LocationSearchInput";

type RawPlantSearchFilters = PlantSearchFiltersNormalized & {
  onlyNative?: boolean;
};

const PlantSearchFilterBar = ({
  applyFilters,
}: {
  applyFilters: (filters?: PlantSearchFiltersNormalized) => void;
}) => {
  const [filters, setFilters] = useState<RawPlantSearchFilters | null>(null);

  const updateFilters = (newFilter: Partial<RawPlantSearchFilters>) =>
    setFilters({ ...filters, ...newFilter });

  const saveFilters = () => {
    if (filters) {
      const { onlyNative, ...rest } = filters;
      applyFilters({
        ...rest,
        establishmentMeans: onlyNative ? ["native"] : undefined,
      });
    } else {
      applyFilters();
    }
  };

  return (
    <Card>
      <div className="flex flex-col space-3">
        <LocationSearchInput setLocationFilter={updateFilters} />
        <div className="flex gap-2">
          <input
            type="checkbox"
            checked={filters?.onlyNative || false}
            onChange={(e) => updateFilters({ onlyNative: e.target.checked })}
          />
          Native plants
        </div>
        <input
          value={filters?.q || ""}
          onChange={(e) => updateFilters({ q: e.target.value })}
          placeholder="Search for a specific plant"
        />
        <button onClick={saveFilters} disabled={!filters}>
          Search
        </button>
      </div>
    </Card>
  );
};

export default PlantSearchFilterBar;
