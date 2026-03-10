import { PlantAction } from "contexts/plantSelection/PlantSelectionContext";
import { GraphQLFormattedError } from "graphql";
import {
  ADD_PLANT_TO_GARDEN,
  GET_ALL_GARDENS,
  UserGarden,
} from "graphqlHelpers/gardenQueries";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useApolloMutation, useApolloQuery } from "hooks/useQuery";
import { TbPlant2 } from "react-icons/tb";
import { toast } from "sonner";
import { handleGraphQlError } from "util/generalUtil";
import { getPlantDisplayNames } from "util/plantUtil";
import { defaultWarningToast } from "util/toastUtil";

export const usePlantSearchActionList = (): PlantAction[] => {
  const [addToGardenMutation] = useApolloMutation(ADD_PLANT_TO_GARDEN);

  const addToGarden = async (plant: PlantResult, garden?: UserGarden) => {
    const customGraphQlErrorHandler = (error: GraphQLFormattedError) =>
      error.extensions?.code === 400
        ? toast.warning(error.message)
        : toast.error(error.message);

    try {
      const { data } = await addToGardenMutation({
        variables: { plantId: plant._id, gardenId: garden?._id },
      });
      if (data?.addToGarden) {
        toast.success(
          `Added "${getPlantDisplayNames(plant).title}" to "${data.addToGarden.gardenName}".`,
        );
      } else if (data) {
        defaultWarningToast();
      }
    } catch (error) {
      handleGraphQlError(error, {
        customErrorHandler: customGraphQlErrorHandler,
      });
    }
  };

  const userGardensQuery = useApolloQuery(GET_ALL_GARDENS);

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
    Icon: garden?.gardenThumbnailUrl ? (
      <img
        className="w-6 h-6 bg-default-background/50 rounded-full"
        src={garden.gardenThumbnailUrl}
      />
    ) : (
      <TbPlant2 />
    ),
    onClick: (plant: PlantResult) => addToGarden(plant, garden),
  });

  return userGardensQuery.data?.allUserGardens?.length
    ? userGardensQuery.data.allUserGardens.map(addToGardenAction)
    : [addToGardenAction()];
};

export default usePlantSearchActionList;
