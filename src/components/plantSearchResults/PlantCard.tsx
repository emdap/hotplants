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
      disableBlurEffect
      className={classNames(
        "cursor-pointer h-40 w-full outline-white/60 transition-all focus-ring m-0 relative p-0 overflow-hidden rounded-lg group bg-default-background bg-clip-padding border-primary/80 dark:border-transparent",
        {
          "bg-default-background dark:bg-default-background/50 outline-2 outline-offset-2 active-card":
            isActive,
          "m-0": !isActive,
        }
      )}
    >
      {firstImage && (
        <>
          <div className="absolute w-full h-full flex items-center overflow-hidden z-0 backdrop-grayscale-100">
            <img src={firstImage} loading="lazy" className="" />
          </div>
          <div className="absolute h-full w-full transition-opacity opacity-100 group-[.active-card]:opactiy-0 group-hover:opacity-0 group-focus:opacity-0 backdrop-grayscale-25 backdrop-contrast-80" />
        </>
      )}

      <div className="flex flex-col w-full gap-2 pt-4 px-6 bg-primary/60 dark:bg-primary-dark/60 text-shadow-glow  relative backdrop-blur-sm group-hover:backdrop-blur-xs">
        {hasCommonName ? (
          <>
            <h2 className="text-white border-b border-white/80 w-full">
              {capitalize(plant.commonNames?.[0])}
            </h2>
            <h6 className="self-end italic -mt-2 text-right">
              {plant.scientificName}
            </h6>
          </>
        ) : (
          <h2 className="text-white italic pb-3">{plant.scientificName}</h2>
        )}
      </div>
    </Card>
  );
};

export default PlantCard;
