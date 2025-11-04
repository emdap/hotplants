import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";

const SKIP_FIELDS_IN_TABLE: (keyof PlantResult | "__typename")[] = [
  "scientificName",
  "_id",
  "__typename",
  "commonNames",
  "occurrences",
];

const PLANT_FIELD_LABEL: { [key in keyof PlantResult]?: string } = {
  bloomColors: "Bloom Colors",
  bloomTimes: "Bloom Times",
  physicalCharactersticsDump: "General Info",
  fullOccurrencesCount: "Total Occurrences",
};

const PlantInfo = ({
  plant,
  showFullInfo,
}: {
  plant: PlantResult;
  showFullInfo?: boolean;
}) => {
  const plantHeader = (
    <>
      {plant.scientificName}
      {plant.commonNames ? ` - ${plant.commonNames.join(", ")}` : ""}
    </>
  );

  return (
    <Card className="overflow-auto">
      {showFullInfo ? (
        <table className="border-separate border-spacing-4 [&_th,td]:p-2">
          <thead>
            <th colSpan={2}>{plantHeader}</th>
          </thead>
          {showFullInfo && (
            <tbody>
              {(Object.entries(plant) as [keyof PlantResult, object][]).map(
                ([key, value], index) =>
                  SKIP_FIELDS_IN_TABLE.includes(key) ? null : (
                    <tr key={index}>
                      <th>{PLANT_FIELD_LABEL[key]}</th>
                      <td>{JSON.stringify(value)}</td>
                    </tr>
                  )
              )}
            </tbody>
          )}
        </table>
      ) : (
        <div className="text-center">{plantHeader}</div>
      )}
    </Card>
  );
};

export default PlantInfo;
