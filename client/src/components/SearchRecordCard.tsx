import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { format } from "date-fns";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import ProgressBar from "designSystem/ProgressBar";
import {
  GET_SEARCH_RECORD_PLANT_COUNT,
  SearchRecordResult,
} from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { ReactNode, useMemo } from "react";
import { MdDoubleArrow } from "react-icons/md";
import { DEFAULT_DATE_FORMAT } from "util/generalUtil";
import { customLocationDisplay } from "util/locationUtil";
import MapProvider from "./interactiveMap/MapProvider";

const SearchRecordCard = ({
  occurrencesOffset,
  totalOccurrences,
  ...searchParams
}: SearchRecordResult) => {
  const { applySearchParams } = usePlantSearchContext();

  const plantCount = useApolloQuery(GET_SEARCH_RECORD_PLANT_COUNT, {
    variables: { id: searchParams._id },
  });

  const { title, subTitle } = useMemo(() => {
    if (searchParams.locationSource === "custom") {
      return { title: customLocationDisplay(searchParams) };
    }

    const splitName = searchParams.locationName.split(", ");
    return {
      title: splitName[0],
      subTitle: splitName.slice(1).join(", "),
    };
  }, [searchParams]);

  return (
    <Card className="flex flex-col gap-4 text-sm">
      <div
        className="border-b border-transparent hover:border-white/80 cursor-pointer pb-0.5 flex gap-4 justify-between items-center"
        onClick={() => applySearchParams(searchParams)}
      >
        <span>
          <h2>{title}</h2>
          <h4>{subTitle}</h4>
        </span>
        <MdDoubleArrow size={24} className="ml-auto shrink-0" />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <MapProvider className="h-60 w-xs grow" searchParams={searchParams} />
        <div className="flex flex-col gap-4 [&_div]:space-y-0.5 grow">
          <InfoRow
            title="Unique plants found in area"
            value={
              plantCount.loading ? (
                <LoadingIcon />
              ) : (
                plantCount.data?.searchRecordPlantCount
              )
            }
          />

          <div className="mt-auto">
            <InfoRow title="Status" value={searchParams.status} />
            <InfoRow
              title="Search created"
              value={format(searchParams.createdTimestamp, DEFAULT_DATE_FORMAT)}
            />
            <InfoRow
              title="Search last ran"
              value={
                searchParams.statusUpdatedTimestamp
                  ? format(
                      searchParams.statusUpdatedTimestamp,
                      DEFAULT_DATE_FORMAT,
                    )
                  : "N/A"
              }
            />
          </div>

          <ProgressBar
            className="mt-auto w-full"
            title="Scraping progress"
            amount={occurrencesOffset}
            total={Math.max(0, totalOccurrences)}
          />
        </div>
      </div>
    </Card>
  );
};

const InfoRow = ({ title, value }: { title: string; value: ReactNode }) => (
  <div className="grid grid-cols-2 items-center">
    <span>{title}</span>
    <strong className="inline-block">{value}</strong>
  </div>
);

export default SearchRecordCard;
