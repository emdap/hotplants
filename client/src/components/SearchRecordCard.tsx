import { useNavigate } from "@tanstack/react-router";
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
import { OPTIONAL_SEARCH_PARAM_FILTERS } from "./plantFilters/filterFixtures";

const SearchRecordCard = ({
  occurrencesOffset,
  totalOccurrences,
  ...searchParams
}: SearchRecordResult) => {
  const navigate = useNavigate();

  const { data: { searchRecordDataCounts } = {}, loading: plantCountLoading } =
    useApolloQuery(GET_SEARCH_RECORD_PLANT_COUNT, {
      variables: { id: searchParams._id },
    });

  const maxPlantCounts = useMemo(() => {
    const actualOccurrences = searchRecordDataCounts?.occurrenceCount ?? 0;

    return {
      total: Math.max(actualOccurrences, totalOccurrences),
      offset: Math.max(actualOccurrences, occurrencesOffset),
    };
  }, [searchRecordDataCounts, totalOccurrences, occurrencesOffset]);

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
        onClick={() =>
          navigate({
            to: "/plant-search",
            search: { search: searchParams, filters: {} },
          })
        }
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
          <div>
            <InfoRow
              title="Unique plants found in area"
              value={
                plantCountLoading ? (
                  <LoadingIcon />
                ) : (
                  searchRecordDataCounts?.plantCount
                )
              }
            />

            {OPTIONAL_SEARCH_PARAM_FILTERS.map(({ plantDataKey, label }) => (
              <InfoRow
                key={plantDataKey}
                title={label}
                value={
                  searchParams[plantDataKey] ?? (
                    <span className="italic font-normal">N/A</span>
                  )
                }
              />
            ))}
          </div>

          <div className="mt-auto">
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
            <InfoRow title="Status" value={searchParams.status} />
          </div>
          <ProgressBar
            className="mt-auto w-full"
            title="Scraping progress"
            unitTitle="Plant Occurrences"
            isLoading={plantCountLoading}
            amount={maxPlantCounts.offset}
            total={maxPlantCounts.total}
            isError={
              searchParams.status === "COMPLETE" && maxPlantCounts?.total === 0
            }
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
