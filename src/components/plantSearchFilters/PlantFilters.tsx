import { PlantDataInput } from "generated/graphql/graphql";

const INPUT_FILTER_FIELDS = ["scientificName", "commonName"] as const;

const PlantFilters = ({
  plantFilters,
  setPlantFilters,
}: {
  plantFilters: PlantDataInput | null;
  setPlantFilters: (
    filters: Omit<PlantDataInput, "boundingBox"> | null
  ) => void;
}) => (
  <>
    {INPUT_FILTER_FIELDS.map((field) => (
      <input
        key={field}
        value={plantFilters?.[field] ?? ""}
        onChange={({ target }) =>
          setPlantFilters({ ...plantFilters, [field]: target.value })
        }
        placeholder={field}
      />
    ))}
  </>
);

export default PlantFilters;
