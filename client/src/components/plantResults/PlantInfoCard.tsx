import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { Entries } from "type-fest";

const PLANT_FIELD_LABEL: { [key in keyof PlantResult]?: string } = {
  fullOccurrencesCount: "Occurrences Found",
  scientificName: "Scientific Name",
  commonNames: "Common Names",
  bloomColors: "Bloom Colors",
  bloomTimes: "Bloom Times",
  isPerennial: "Perennial",
  height: "Height",
  spread: "Spread",
  physicalCharactersticsDump: "General Info",
};

const PlantInfoCard = ({ plant }: { plant: PlantResult }) => (
  <Card className="big-screen:overflow-auto flex-grow">
    <table className="border-separate border-spacing-4 [&_th,td]:p-2 w-full">
      <tbody>
        {(Object.entries(plant) as Entries<PlantResult>).map(
          ([key, value], index) =>
            PLANT_FIELD_LABEL[key] && (
              <tr key={index} className="grid grid-cols-[2fr_3fr]">
                <th className="text-left">{PLANT_FIELD_LABEL[key]}</th>
                <td className="text-right break-all">
                  {Array.isArray(value)
                    ? value.join(", ")
                    : typeof value === "string"
                      ? value
                      : JSON.stringify(value)}
                </td>
              </tr>
            ),
        )}
      </tbody>
    </table>
  </Card>
);

export default PlantInfoCard;
