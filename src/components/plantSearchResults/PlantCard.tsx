import classNames from "classnames";
import Card from "designSystem/Card";
import { MOTION_FADE_SLIDE } from "designSystem/motionTransitions";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { capitalize } from "lodash";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import { useRef } from "react";
import PlantImage from "./PlantImage";

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
  const firstMedia = plant.thumbnailUrl
    ? { url: plant.thumbnailUrl }
    : firstOccurrence?.media[0];

  return (
    <Card
      {...MOTION_FADE_SLIDE}
      transition={{ duration: 0.1, delay: (index % DEFAULT_PAGE_SIZE) * 0.05 }}
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
        "cursor-pointer h-50 outline-white/60 transition-all m-0 relative p-0 overflow-hidden rounded-lg group bg-clip-padding border-primary/80 dark:border-transparent bg-transparent",

        isActive ? "active-card focus-ring outline-2 outline-offset-2" : "m-0"
      )}
    >
      {firstOccurrence && (
        <PlantImage
          plantId={plant._id}
          occurrenceId={firstOccurrence.occurrenceId}
          mediaObject={firstMedia}
          containerClass="absolute w-full h-full flex items-center overflow-hidden z-0"
          imageClass="w-full"
        >
          {({ isLoaded }) =>
            isLoaded ? (
              <div className="absolute h-full w-full transition-opacity opacity-100 group-[.active-card]:opacity-0 group-hover:opacity-0 bg-primary-dark/30" />
            ) : (
              <>
                <img
                  className="absolute bottom-0 opacity-30"
                  src={plantPlaceholder}
                />
                <div className="absolute h-full w-full bg-gray-600/50 animate-pulse" />
              </>
            )
          }
        </PlantImage>
      )}

      <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 md:min-h-20 justify-center bg-primary/70 dark:bg-primary-dark/70 text-shadow-glow relative">
        {hasCommonName ? (
          <>
            <h2 className="max-md:text-lg text-white border-b border-white/80 w-full">
              {capitalize(plant.commonNames?.[0])}
            </h2>
            <h6 className="max-md:text-sm self-end italic -mt-1.5 pb-1 text-right">
              {plant.scientificName}
            </h6>
          </>
        ) : (
          <h2 className="max-md:text-lg text-white italic pb-3">
            {plant.scientificName}
          </h2>
        )}
      </div>
    </Card>
  );
};

export default PlantCard;
