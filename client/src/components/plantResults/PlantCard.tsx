import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Card from "designSystem/Card";
import { PlantResult } from "graphqlHelpers/plantQueries";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import { useEffect, useRef } from "react";
import { getPlantDisplayNames } from "util/plantUtil";
import PlantActions from "./PlantActions";
import PlantOccurrenceImage from "./PlantOccurrenceImage";

const PlantCard = ({ plant }: { plant: PlantResult }) => {
  const { activePlantId, setActivePlantId } = usePlantSelectionContext();

  const plantCardRef = useRef<HTMLDivElement>(null);
  const isRightClick = useRef(false);

  const isActive = activePlantId === plant._id;
  useEffect(() => {
    isActive && plantCardRef.current?.focus();
  }, [isActive]);

  const setActive = () => setActivePlantId(plant._id);

  const firstOccurrence = plant.occurrences[0];
  const firstMedia = firstOccurrence?.media[0];

  const hasCommonName = plant.commonNames?.length;
  const plantDisplayNames = getPlantDisplayNames(plant);

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
      <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 min-h-1/4 md:min-h-20 justify-center bg-accent/80 text-shadow-glow relative z-10">
        <h2
          className={classNames("text-white max-sm:text-lg pr-6", {
            "border-b border-white/80 w-full": hasCommonName,
            "italic pb-3": !hasCommonName,
          })}
        >
          {plantDisplayNames.title}
        </h2>

        <div
          className="absolute right-2 top-2 [&_button]:bg-default-background/60 [&_button]:hover:bg-default-background/80!  rounded-md hover:text-default-text"
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
        >
          <PlantActions plant={plant} />
        </div>

        {plantDisplayNames.subTitle && (
          <h6 className="max-sm:text-sm text-white/80 self-end italic -mt-1.5 pb-1 text-right">
            {plantDisplayNames.subTitle}
          </h6>
        )}
      </div>

      {firstOccurrence && (
        <PlantOccurrenceImage
          plantId={plant._id}
          thumbnailUrl={plant.thumbnailUrl}
          occurrenceId={firstOccurrence.occurrenceId}
          mediaObject={firstMedia}
          containerClass="absolute top-0 w-full h-full flex items-center overflow-hidden z-0"
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
    </Card>
  );
};

export default PlantCard;
