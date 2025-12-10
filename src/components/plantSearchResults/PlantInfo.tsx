import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";

const PLANT_FIELD_LABEL: { [key in keyof PlantResult]?: string } = {
  bloomColors: "Bloom Colors",
  bloomTimes: "Bloom Times",
  isPerennial: "Perennial",
  physicalCharactersticsDump: "General Info",
  fullOccurrencesCount: "Occurrences Found",
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
    <Card className="overflow-auto flex-grow">
      {showFullInfo ? (
        <table className="border-separate border-spacing-4 [&_th,td]:p-2 w-full">
          <thead>
            <tr>
              <th colSpan={2}>{plantHeader}</th>
            </tr>
          </thead>
          {showFullInfo && (
            <tbody>
              {(Object.entries(plant) as [keyof PlantResult, object][]).map(
                ([key, value], index) =>
                  PLANT_FIELD_LABEL[key] && (
                    <tr key={index} className="grid grid-cols-[1fr_3fr]">
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
