import { CombinedGraphQLErrors } from "@apollo/client";
import classNames from "classnames";
import { useIsSignedIn } from "config/authClient";
import Button from "designSystem/Button";
import { ADD_PLANT_TO_GARDEN } from "graphqlHelpers/gardenQueries";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useApolloMutation } from "hooks/useQuery";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { getPlantDisplayNames } from "util/plantUtil";
import { defaultErrorToast, defaultWarningToast } from "util/toastUtil";

const PlantCardHeader = ({ plant }: { plant: PlantResult }) => {
  const isSignedIn = useIsSignedIn();
  const hasCommonName = plant.commonNames?.length;
  const plantDisplayNames = getPlantDisplayNames(plant);

  const retryAddAction = {
    action: { label: "Retry", onClick: () => gardenAddMutation() },
  };

  const [gardenAddMutation, { loading: gardenAddLoading }] = useApolloMutation(
    ADD_PLANT_TO_GARDEN,
    { variables: { plantId: plant._id } },
  );

  const run = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const { data } = await gardenAddMutation();
      if (data?.addToGarden) {
        toast.success(
          `Added "${plantDisplayNames.title}" to "${data.addToGarden.gardenName}".`,
        );
      } else if (data) {
        defaultWarningToast(retryAddAction);
      }
    } catch (error) {
      if (error instanceof CombinedGraphQLErrors) {
        error.errors.map((error) => {
          if (error.message) {
            error.extensions?.code === 400
              ? toast.warning(error.message)
              : toast.error(error.message, retryAddAction);
          } else {
            defaultErrorToast(retryAddAction);
          }
        });
      } else {
        defaultErrorToast(retryAddAction);
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-2 pt-2 px-4 md:px-6 min-h-1/4 md:min-h-20 justify-center bg-accent/80 text-shadow-glow relative">
      <h2
        className={classNames(
          "text-white max-sm:text-lg",
          isSignedIn && "pr-6",
          hasCommonName ? "border-b border-white/80 w-full" : "italic pb-3",
        )}
      >
        {plantDisplayNames.title}
      </h2>
      {plantDisplayNames.subTitle && (
        <h6 className="max-sm:text-sm text-white/80 self-end italic -mt-1.5 pb-1 text-right">
          {plantDisplayNames.subTitle}
        </h6>
      )}
      {isSignedIn && (
        <Button
          className="absolute top-0 right-0 text-white!"
          onClick={run}
          onMouseDown={(e) => e.preventDefault()}
          variant="icon-white"
          isLoading={gardenAddLoading}
          disableOnLoading
          icon={<FaHeart />}
        />
      )}
    </div>
  );
};

export default PlantCardHeader;
