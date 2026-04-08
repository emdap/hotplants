import { PLANT_UNIT_SHORT_LABELS } from "components/dataControls/filterUtil";
import { PlantResult } from "contexts/plantSelection/PlantSelectionContext";
import { format } from "date-fns";
import Card, { CardProps } from "designSystem/Card";
import { ReactNode } from "react";
import { DEFAULT_DATE_TIME_FORMAT } from "util/generalUtil";

const ORDERED_PLANT_FIELDS: [keyof PlantResult, string][] = [
  ["scientificName", "Scientific name"],
  ["commonNames", "Common names"],
  ["bloomColors", "Bloom colors"],
  ["isPerennial", "Perennial?"],
  ["height", "Plant height"],
  ["spread", "Plant spread"],
  ["fullOccurrencesCount", "Occurrences found"],
  ["updatedTimestamp", "Data last updated"],
];

const PlantInfo = ({
  plant,
  ...cardProps
}: { plant: PlantResult } & CardProps) => (
  <div className="space-y-6">
    <InfoWrapper title="Plant stats" {...cardProps}>
      <table className="border-separate border-spacing-4 [&_th,td]:p-2 w-full">
        <tbody>
          {ORDERED_PLANT_FIELDS.map(([key, title]) => {
            const value = plant[key] ?? null;
            return (
              value !== null && (
                <tr key={key} className="grid grid-cols-[2fr_3fr]">
                  <th className="text-left">{title}</th>
                  <td className="text-right break-all">
                    {key === "updatedTimestamp"
                      ? format(value as number, DEFAULT_DATE_TIME_FORMAT)
                      : Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "object"
                          ? `${value.amount} ${PLANT_UNIT_SHORT_LABELS[value.unit]}`
                          : String(value)}
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
    </InfoWrapper>

    {plant.physicalCharactersticsDump && (
      <InfoWrapper title="General plant info" {...cardProps}>
        {plant.physicalCharactersticsDump}
      </InfoWrapper>
    )}
  </div>
);

const InfoWrapper = ({
  title,
  children,
  ...cardProps
}: { title: string; children: ReactNode } & CardProps) => (
  <div className="flex flex-col gap-3 overflow-hidden">
    <h5 className="px-4">{title}</h5>
    <Card {...cardProps}>{children}</Card>
  </div>
);

export default PlantInfo;
