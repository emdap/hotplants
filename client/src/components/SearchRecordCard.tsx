import { polygon } from "@turf/turf";
import Card from "designSystem/Card";
import { SearchRecordResult } from "graphqlHelpers/searchRecordQueries";
import { useMemo } from "react";
import MapProvider from "./interactiveMap/MapProvider";

const SearchRecordCard = ({
  searchRecord: {
    locationName,
    totalOccurrences,
    occurrencesOffset,
    boundingPolyCoords,
  },
}: {
  searchRecord: SearchRecordResult;
}) => {
  const { title, subTitle } = useMemo(() => {
    const splitName = locationName.split(", ");
    return {
      title: splitName[0],
      subTitle: splitName.slice(1).join(", "),
    };
  }, [locationName]);

  return (
    <Card>
      <h2>{title}</h2>
      <h4>{subTitle}</h4>
      <div className="flex gap-4">
        <MapProvider
          className="h-60 w-xs"
          searchLocation={{
            locationSource: "search",
            displayName: locationName,
            boundingPolygon: polygon(boundingPolyCoords),
          }}
        />
        <p>
          {occurrencesOffset} / {totalOccurrences}
        </p>
      </div>
    </Card>
  );
};

export default SearchRecordCard;
