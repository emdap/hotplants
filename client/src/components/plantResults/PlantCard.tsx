import classNames from "classnames";
import { useIsSignedIn } from "config/authClient";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { MOTION_FADE_SLIDE } from "designSystem/motionTransitions";
import { ADD_PLANT_TO_GARDEN } from "graphqlHelpers/gardenQueries";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { useApolloMutation } from "hooks/useQuery";
import { capitalize } from "lodash";
import plantPlaceholder from "placeholderImages/plantPlaceholder.png";
import { useRef } from "react";
import { FaHeart } from "react-icons/fa";
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

  const firstOccurrence = plant.occurrences[0];
  const firstMedia = firstOccurrence?.media[0];

  return (
    <Card
      {...MOTION_FADE_SLIDE}
      transition={{ duration: 0.1, delay: (index % DEFAULT_PAGE_SIZE) * 0.03 }}
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
        "cursor-pointer h-[30vh] md:h-60 outline-white/60 transition-all relative p-0 overflow-hidden rounded-lg group bg-clip-padding border-transparent bg-transparent",

        isActive ? "active-card focus-ring outline-2 outline-offset-2" : "m-0"
      )}
    >
      {firstOccurrence && (
        <PlantOccurrenceImage
          plantId={plant._id}
          thumbnailUrl={plant.thumbnailUrl}
          occurrenceId={firstOccurrence.occurrenceId}
          mediaObject={firstMedia}
          hideOnScroll
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

      <PlantCardHeader plant={plant} />
    </Card>
  );
};

const PlantCardHeader = ({ plant }: { plant: PlantResult }) => {
  const isSignedIn = useIsSignedIn();
  const commonName = plant.commonNames?.[0];

  const [addPlantToGarden, { loading: addPlantLoading }] = useApolloMutation(
    ADD_PLANT_TO_GARDEN,
    {
      variables: { plantId: plant._id },
    }
  );

  return (
    <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 min-h-1/4 md:min-h-20 justify-center bg-accent/80 text-shadow-glow relative">
      <h2
        className={classNames(
          "text-white max-sm:text-lg",
          isSignedIn && "pr-6",
          commonName ? "border-b border-white/80 w-full" : "italic pb-3"
        )}
      >
        {commonName ? capitalize(commonName) : plant.scientificName}
      </h2>
      {commonName && (
        <h6 className="max-sm:text-sm text-white/80 self-end italic -mt-1.5 pb-1 text-right">
          {plant.scientificName}
        </h6>
      )}
      {isSignedIn && (
        <Button
          className="absolute top-0 right-0 text-white!"
          onClick={(e) => {
            e.stopPropagation();
            addPlantToGarden();
          }}
          variant="icon-white"
          disabled={addPlantLoading}
          icon={<FaHeart />}
        />
      )}
    </div>
  );
};

export default PlantCard;
