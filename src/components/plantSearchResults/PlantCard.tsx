import classNames from "classnames";
import Card from "designSystem/Card";
import { MOTION_FADE_SLIDE } from "designSystem/motionTransitions";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";

const PlantCard = ({
  plant,
  isActive,
  setActive,
}: {
  plant: PlantResult;
  isActive: boolean;
  setActive: () => void;
}) => {
  const hasCommonName = Boolean(plant.commonNames?.length);
  const firstImage = plant.occurrences[0]?.media[0]?.url;

  return (
    <Card
      {...MOTION_FADE_SLIDE}
      id={plant.scientificName}
      onClick={setActive}
      onFocus={setActive}
      tabIndex={1}
      className={classNames(
        "cursor-pointer h-40 w-full outline-white/60 transition-all focus-ring relative !p-0 bg-transparent! overflow-hidden rounded-lg!",
        {
          "!bg-default-background dark:!bg-default-background/50": isActive,
          "m-0": !isActive,
        }
      )}
    >
      {firstImage && (
        <div className="absolute w-full h-full flex items-center overflow-hidden -z-10 opacity-80">
          <img src={firstImage} loading="lazy" />
        </div>
      )}

      <div className="flex flex-col w-full gap-2 py-4 px-6 bg-primary/80">
        {hasCommonName ? (
          <>
            <h2 className="text-white">{capitalize(plant.commonNames?.[0])}</h2>
            <h4 className="self-end italic -mt-8 border-b w-full text-right">
              {plant.scientificName}
            </h4>
          </>
        ) : (
          <h2 className="italic">{plant.scientificName}</h2>
        )}
      </div>
    </Card>
  );
};

export default PlantCard;
