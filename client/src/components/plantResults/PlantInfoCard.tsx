import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";

const PLANT_FIELD_LABEL: { [key in keyof PlantResult]?: string } = {
  bloomColors: "Bloom Colors",
  bloomTimes: "Bloom Times",
  isPerennial: "Perennial",
  physicalCharactersticsDump: "General Info",
  fullOccurrencesCount: "Occurrences Found",
};

const PlantInfoCard = ({ plant }: { plant: PlantResult }) => (
  <Card className="big-screen:overflow-auto flex-grow">
    <table className="border-separate border-spacing-4 [&_th,td]:p-2 w-full">
      <tbody>
        {(Object.entries(plant) as [keyof PlantResult, object][]).map(
          ([key, value], index) =>
            PLANT_FIELD_LABEL[key] && (
              <tr key={index} className="grid grid-cols-[2fr_3fr]">
                <th className="text-left">{PLANT_FIELD_LABEL[key]}</th>
                <td className="text-right">{JSON.stringify(value)}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  </Card>
);

export default PlantInfoCard;
