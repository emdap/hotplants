import { useIsSignedIn } from "config/authConfig";
import {
  PlantAction,
  PlantResult,
} from "contexts/plantSelection/PlantSelectionContext";
import { GraphQLFormattedError } from "graphql";
import {
  ADD_PLANT_TO_GARDEN,
  GET_ALL_GARDENS,
  UserGarden,
} from "graphqlHelpers/gardenQueries";
import { useApolloMutation, useApolloQuery } from "hooks/useQuery";
import { TbPlant2 } from "react-icons/tb";
import { toast } from "sonner";
import { handleGraphQlError } from "util/generalUtil";
import { getPlantDisplayNames } from "util/plantUtil";
import { needsAuthenticationToast } from "util/toastUtil";
import GoToGardenLink from "./GoToGardenLink";

export const useAddToGardenActionList = (
  excludeIds?: string[],
): PlantAction[] => {
  const isSignedIn = useIsSignedIn();

  const customGraphQlErrorHandler = (
    error: GraphQLFormattedError,
    garden?: UserGarden,
  ) => {
    if (error.extensions?.code === 400) {
      toast.warning(
        <>
          {error.message}
          <GoToGardenLink gardenName={garden?.gardenName} />
        </>,
      );
    } else {
      toast.error(error.message);
    }
  };

  const [addToGardenMutation] = useApolloMutation(ADD_PLANT_TO_GARDEN);

  const addToGarden = async (plant: PlantResult, garden?: UserGarden) => {
    try {
      const { data } = await addToGardenMutation({
        variables: { plantId: plant._id, gardenId: garden?._id },
      });
      const gardenName = data?.addToGarden?.gardenName;

      toast.success(
        <>
          Added "{getPlantDisplayNames(plant).title}" to "
          {gardenName ?? "garden"}".`,
          <GoToGardenLink gardenName={gardenName} />
        </>,
      );
    } catch (error) {
      handleGraphQlError(error, {
        customErrorHandler: (data) => customGraphQlErrorHandler(data, garden),
      });
    }
  };

  const userGardensQuery = useApolloQuery(GET_ALL_GARDENS, {
    skip: !isSignedIn,
  });

  const addToGardenAction = (garden?: UserGarden): PlantAction => ({
    label: (
      <span>
        Add to{" "}
        {garden ? (
          <span className="italic">{garden.gardenName}</span>
        ) : (
          "garden"
        )}
      </span>
    ),
    iconNode: garden?.gardenThumbnailUrl ? (
      <img
        className="w-6 h-6 bg-default-background/50 rounded-full"
        src={garden.gardenThumbnailUrl}
      />
    ) : (
      <TbPlant2 />
    ),
    onClick: (plant: PlantResult) =>
      isSignedIn ? addToGarden(plant, garden) : needsAuthenticationToast(),
  });

  const gardenActions = userGardensQuery.data?.allUserGardens?.length
    ? userGardensQuery.data.allUserGardens.reduce<PlantAction[]>(
        (prev, cur) => {
          if (excludeIds?.includes(cur._id)) {
            return prev;
          }
          prev.push(addToGardenAction(cur));
          return prev;
        },
        [],
      )
    : [addToGardenAction()];

  return gardenActions;
};

export default useAddToGardenActionList;
