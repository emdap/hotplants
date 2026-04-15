import {
  getOrderedFilterEntries,
  PLANT_UNIT_SHORT_LABELS,
} from "components/dataControls/filterUtil";
import { COMPLETE_FILTER_DICT } from "components/plantDataControls/plantFilters/plantFilterUtil";
import { PlantResult } from "contexts/plantSelection/PlantSelectionContext";
import { format } from "date-fns";
import Card, { CardProps } from "designSystem/Card";
import { EntityType } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import { ReactNode } from "react";
import { DEFAULT_DATE_TIME_FORMAT } from "util/generalUtil";

const { physicalCharactersticsDump: _dump, ...plantFilterLabels } =
  COMPLETE_FILTER_DICT;

const ORDERED_PLANT_FIELDS = getOrderedFilterEntries({
  ...plantFilterLabels,
  scientificName: { label: "Scientific name", order: -1 },
  commonNames: { label: "Common name", order: -1 },
  fullOccurrencesCount: { label: "Occurrences found" },
  updatedTimestamp: { label: "Data last updated" },
}).map(([key, filterValue]) =>
  filterValue?.label ? [key, filterValue.label] : [],
) as [keyof PlantResult, string][];

const PlantInfo = ({
  plant,
  entityType,
  ...cardProps
}: { plant: PlantResult; entityType: EntityType } & CardProps) => (
  <div className="space-y-6">
    <InfoWrapper title={`${capitalize(entityType)} stats`} {...cardProps}>
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
