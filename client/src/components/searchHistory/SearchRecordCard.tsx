import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import { PLANT_NAME_FIELDS } from "components/plantDataControls/plantSearchFormUtil";
import PlantOccurrenceImage from "components/plantResults/PlantOccurrenceImage";
import { format } from "date-fns";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import {
  GET_SEARCH_RECORD_PLANT_COUNT,
  SearchRecordResult,
} from "graphqlHelpers/searchRecordQueries";
import { useApolloQuery } from "hooks/useQuery";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import pluralize from "pluralize";
import { ReactNode, useMemo } from "react";
import { MdDoubleArrow } from "react-icons/md";
import { RiBearSmileFill, RiPlantFill } from "react-icons/ri";
import { DEFAULT_DATE_TIME_FORMAT } from "util/generalUtil";
import { locationDisplay, validateLocationParams } from "util/locationUtil";
import SearchRecordProgressBar from "./SearchRecordProgressBar";

const SearchRecordCard = ({
  _id,
  entityType,
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
  const { firstPlant } = searchRecordDataCounts ?? {};

  const locationParams = useMemo(
    () => validateLocationParams(searchParams),
    [searchParams],
  );

  const { title, subTitle } = useMemo(() => {
    if (locationParams) {
      return locationDisplay(locationParams);
    }

    return {
      title: searchParams.commonName ?? searchParams.scientificName,
      subTitle: undefined,
    };
  }, [locationParams, searchParams.commonName, searchParams.scientificName]);

  const openSearchRecord = async () => {
    await navigate({
      to: ".",
      search: (prev) => ({ ...prev, lastOpened: _id }),
      replace: true,
    });

    const entityName = searchParams.commonName
      ? { commonName: searchParams.commonName }
      : searchParams.scientificName
        ? { scientificName: searchParams.scientificName }
        : undefined;

    navigate({
      to: entityType === "plant" ? "/browse-plants" : "/browse-animals",
      search: { location: locationParams, entityName, page: 1 },
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
        className="border-b border-transparent hover:border-default-text/80 transition-colors cursor-pointer pb-0.5 flex gap-4 justify-between items-center"
        onClick={openSearchRecord}
      >
        {entityType === "plant" ? (
          <RiPlantFill size={20} />
        ) : (
          <RiBearSmileFill size={20} />
        )}
        <span>
          <h2>{title}</h2>
          <h4>{subTitle}</h4>
        </span>
        <MdDoubleArrow size={24} className="ml-auto shrink-0" />
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {locationParams ? (
          <MapProvider
            className="h-60 w-xs grow"
            locationParams={locationParams}
            dragging={false}
            boxZoom={false}
            touchZoom={false}
            scrollWheelZoom={false}
          />
        ) : (
          <div className="h-60 w-full md:w-3/7 flex md:justify-center">
            {firstPlant ? (
              <PlantOccurrenceImage
                plantId={firstPlant._id}
                occurrenceId={firstPlant.occurrenceId}
                thumbnailUrl={firstPlant.thumbnailUrl}
                mediaObject={firstPlant}
                showSpinner
                showSpinnerBg
                imageClass="max-h-full rounded-md"
              />
            ) : (
              <img
                src={plantPlaceholder}
                className={classNames("rounded-md", {
                  "animate-pulse opacity-30": plantCountLoading,
                  "opacity-50": !plantCountLoading,
                })}
              />
            )}
          </div>
        )}
        <div className="flex flex-col gap-4 [&_div]:space-y-0.5 grow">
          <div>
            <InfoRow
              title={`Unique ${pluralize(entityType)} found in area`}
              value={
                plantCountLoading ? (
                  <LoadingIcon />
                ) : (
                  searchRecordDataCounts?.plantCount
                )
              }
            />

            {PLANT_NAME_FIELDS.map(({ dataKey, label }) => (
              <InfoRow
                key={dataKey}
                title={label}
                value={
                  searchParams[dataKey] ?? (
                    <span className="italic font-normal">N/A</span>
                  )
                }
              />
            ))}
          </div>

          <div className="mt-auto">
            <InfoRow
              title="Search last ran"
              value={formatDate(searchParams.lastRanTimestamp)}
            />
            <InfoRow
              title="Search created"
              value={formatDate(searchParams.createdTimestamp)}
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
