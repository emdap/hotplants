import classNames from "classnames";
import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import { useEffect, useRef } from "react";
import PlantCardHeader from "./PlantCardHeader";
import PlantOccurrenceImage from "./PlantOccurrenceImage";

const PlantCard = ({
  plant,
  isActive,
  setActive,
}: {
  plant: PlantResult;
  isActive: boolean;
  setActive: () => void;
}) => {
  const plantCardRef = useRef<HTMLDivElement>(null);
  const isRightClick = useRef(false);

  const firstOccurrence = plant.occurrences[0];
  const firstMedia = firstOccurrence?.media[0];

  useEffect(() => {
    isActive && plantCardRef.current?.focus();
  }, [isActive]);

  return (
    <Card
      ref={plantCardRef}
      id={plant.scientificName}
      onClick={setActive}
      onFocus={() => !isRightClick.current && setActive()}
      onMouseDown={(e) => {
        if (e.button === 2) {
          isRightClick.current = true;
        }
      }}
      onMouseUp={() => (isRightClick.current = false)}
      tabIndex={1}
      className={classNames(
        "cursor-pointer h-40 big-screen:h-60 outline-white/60 relative p-0 overflow-hidden rounded-lg group bg-clip-padding border-transparent bg-transparent",

        isActive ? "active-card focus-ring outline-2 outline-offset-2" : "m-0",
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
              <div className="absolute h-full w-full transition-opacity opacity-80 group-[.active-card]:opacity-0 group-hover:opacity-0 bg-primary-dark/30" />
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

      <PlantCardHeader plant={plant} />
    </Card>
  );
};

export default PlantCard;
