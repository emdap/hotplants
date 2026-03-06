import { useNavigate } from "@tanstack/react-router";
import { OPTIONAL_SEARCH_PARAM_FILTERS } from "components/plantSearch/optionalPlantSearchFieldsUtil";
import { format } from "date-fns";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import {
  GET_SEARCH_RECORD_PLANT_COUNT,
  SearchRecordResult,
} from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import { ReactNode, useMemo } from "react";
import { MdDoubleArrow } from "react-icons/md";
import { DEFAULT_DATE_TIME_FORMAT } from "util/generalUtil";
import { locationDisplay } from "util/locationUtil";
import MapProvider from "../interactiveMap/MapProvider";
import SearchRecordProgressBar from "./SearchRecordProgressBar";

const SearchRecordCard = ({
  _id,
  occurrencesOffset,
  totalOccurrences,
  status,
  ...searchParams
}: SearchRecordResult) => {
  const navigate = useNavigate();

  const { data: { searchRecordDataCounts } = {}, loading: plantCountLoading } =
    useApolloQuery(GET_SEARCH_RECORD_PLANT_COUNT, {
      variables: { id: _id },
    });

  const { title, subTitle } = useMemo(
    () => locationDisplay(searchParams),
    [searchParams],
  );

  const openSearchRecord = async () => {
    await navigate({
      to: ".",
      search: (prev) => ({ ...prev, lastOpened: _id }),
      replace: true,
    });
    navigate({
      to: "/plant-search",
      search: { search: searchParams, page: 1 },
    });
  };

  const formatDate = (timestamp?: number | null) =>
    timestamp ? format(new Date(timestamp), DEFAULT_DATE_TIME_FORMAT) : "N/A";

  return (
    <Card
      id={_id}
      className="flex flex-col gap-4 text-sm scroll-m-header-2"
      {...MOTION_FADE_IN}
    >
      <div
        className="border-b border-transparent hover:border-default-text/80 cursor-pointer pb-0.5 flex gap-4 justify-between items-center"
        onClick={openSearchRecord}
      >
        <span>
          <h2>{title}</h2>
          <h4>{subTitle}</h4>
        </span>
        <MdDoubleArrow size={24} className="ml-auto shrink-0" />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <MapProvider
          className="h-60 w-xs grow"
          searchParams={searchParams}
          dragging={false}
          boxZoom={false}
          touchZoom={false}
          scrollWheelZoom={false}
        />
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
              value={formatDate(searchParams.createdTimestamp)}
            />
            <InfoRow
              title="Search last ran"
              value={formatDate(searchParams.lastRanTimestamp)}
            />
            <InfoRow title="Status" value={status} />
          </div>
          <SearchRecordProgressBar
            {...{ occurrencesOffset, totalOccurrences, status }}
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
