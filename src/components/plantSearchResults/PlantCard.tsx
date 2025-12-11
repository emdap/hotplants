import classNames from "classnames";
import Card from "components/designSystem/Card";
import { MOTION_FADE_SLIDE } from "components/designSystem/motionTransitions";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { capitalize } from "lodash";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import { useRef } from "react";
import PlantOccurrenceImage from "../plantImages/PlantOccurrenceImage";

const PlantCard = ({
  plant,
  index,
  isActive,
  setActive,
}: {
  plant: PlantResult;
  index: number;
  isActive: boolean;
  setActive: () => void;
}) => {
  const isRightClick = useRef(false);

  const hasCommonName = Boolean(plant.commonNames?.length);
  const firstOccurrence = plant.occurrences[0];
  const firstMedia = firstOccurrence?.media[0];

  return (
    <Card
      {...MOTION_FADE_SLIDE}
      transition={{ duration: 0.1, delay: (index % DEFAULT_PAGE_SIZE) * 0.03 }}
      id={plant.scientificName}
      onClick={setActive}
      onFocus={() => !isRightClick.current && setActive}
      onMouseDown={(e) => {
        if (e.button === 2) {
          isRightClick.current = true;
        }
      }}
      onMouseUp={() => (isRightClick.current = false)}
      tabIndex={1}
      className={classNames(
        "cursor-pointer h-50 md:h-60 outline-white/60 transition-all m-0 relative p-0 overflow-hidden rounded-lg group bg-clip-padding border-transparent bg-transparent",

        isActive ? "active-card focus-ring outline-2 outline-offset-2" : "m-0"
      )}
    >
      {firstOccurrence && (
        <PlantOccurrenceImage
          plantId={plant._id}
          thumbnailUrl={plant.thumbnailUrl}
          occurrenceId={firstOccurrence.occurrenceId}
          mediaObject={firstMedia}
          containerClass="absolute w-full h-full flex items-center overflow-hidden z-0"
          imageClass="w-full min-h-full"
        >
          {({ isLoaded, isError }) =>
            isLoaded ? (
              <div className="absolute h-full w-full transition-opacity opacity-100 group-[.active-card]:opacity-0 group-hover:opacity-0 max-md:opacity-80 bg-primary-dark/30" />
            ) : (
              <>
                <img
                  className="absolute bottom-0 opacity-30"
                  src={plantPlaceholder}
                />
                <div
                  className={classNames("absolute h-full w-full", {
                    "animate-pulse bg-gray-600/50": !isError,
                    "group-hover:opacity-30 bg-gray-600 opacity-40": isError,
                  })}
                />
              </>
            )
          }
        </PlantOccurrenceImage>
      )}

      <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 md:min-h-20 justify-center  bg-accent/80 text-shadow-glow relative">
        {hasCommonName ? (
          <>
            <h2 className="max-md:text-lg border-b border-white/80 w-full">
              {capitalize(plant.commonNames?.[0])}
            </h2>
            <h6 className="max-md:text-sm text-white/80 self-end italic -mt-1.5 pb-1 text-right">
              {plant.scientificName}
            </h6>
          </>
        ) : (
          <h2 className="max-md:text-lg italic pb-3">{plant.scientificName}</h2>
        )}
      </div>
    </Card>
  );
};

export default PlantCard;
