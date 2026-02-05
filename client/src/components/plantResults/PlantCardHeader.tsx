import classNames from "classnames";
import { useIsSignedIn } from "config/authClient";
import Button from "designSystem/Button";
import { ADD_PLANT_TO_GARDEN } from "graphqlHelpers/gardenQueries";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useApolloMutation } from "hooks/useQuery";
import { FaHeart } from "react-icons/fa";
import { getPlantDisplayName } from "util/generalUtil";

const PlantCardHeader = ({ plant }: { plant: PlantResult }) => {
  const isSignedIn = useIsSignedIn();
  const hasCommonName = plant.commonNames?.length;

  const [addPlantToGarden, gardenAddMutation] = useApolloMutation(
    ADD_PLANT_TO_GARDEN,
    {
      variables: { plantId: plant._id },
    },
  );

  return (
    <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 min-h-1/4 md:min-h-20 justify-center bg-accent/80 text-shadow-glow relative">
      <h2
        className={classNames(
          "text-white max-sm:text-lg",
          isSignedIn && "pr-6",
          hasCommonName ? "border-b border-white/80 w-full" : "italic pb-3",
        )}
      >
        {getPlantDisplayName(plant)}
      </h2>
      {hasCommonName && (
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
          disabled={gardenAddMutation.loading}
          icon={<FaHeart />}
        />
      )}
    </div>
  );
};

export default PlantCardHeader;
