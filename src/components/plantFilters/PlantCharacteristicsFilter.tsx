import { PlantDataInput } from "generated/graphql/graphql";

const INPUT_FILTER_FIELDS = ["scientificName", "commonName"] as const;

const PlantCharacteristicsFilter = ({
  plantFilterInput,
  setPlantFilterInput,
}: {
  plantFilterInput: PlantDataInput | null;
  setPlantFilterInput: (
    filters: Omit<PlantDataInput, "boundingBox"> | null
  ) => void;
}) => (
  <>
    {INPUT_FILTER_FIELDS.map((field) => (
      <input
        key={field}
        value={plantFilterInput?.[field] ?? ""}
        onChange={({ target }) =>
          setPlantFilterInput({ ...plantFilterInput, [field]: target.value })
        }
        placeholder={field}
      />
    ))}
  </>
);

export default PlantCharacteristicsFilter;
