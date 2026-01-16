import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import { SearchRecordResult } from "graphqlHelpers/searchRecordQueries";
import { useMemo } from "react";
import MapProvider from "./interactiveMap/MapProvider";

const SearchRecordCard = ({
  occurrencesOffset,
  totalOccurrences,
  ...searchParams
}: SearchRecordResult) => {
  const { applySearchParams } = usePlantSearchContext();

  const { title, subTitle } = useMemo(() => {
    const splitName = searchParams.locationName.split(", ");
    return {
      title: splitName[0],
      subTitle: splitName.slice(1).join(", "),
    };
  }, [searchParams.locationName]);

  return (
    <Card onClick={() => applySearchParams(searchParams)}>
      <h2>{title}</h2>
      <h4>{subTitle}</h4>
      <div className="flex gap-4">
        <MapProvider className="h-60 w-xs" searchParams={searchParams} />
        <p>
          {occurrencesOffset} / {totalOccurrences}
        </p>
      </div>
    </Card>
  );
};

export default SearchRecordCard;
