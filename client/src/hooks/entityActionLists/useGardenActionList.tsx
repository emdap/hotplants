import {
  EntityAction,
  EntityResult,
} from "contexts/entitySelection/EntitySelectionContext";
import { REMOVE_PLANT_FROM_GARDEN } from "graphqlHelpers/gardenQueries";
import { useApolloMutation } from "hooks/useQuery";
import { FaHeartBroken } from "react-icons/fa";
import { toast } from "sonner";
import { getEntityDisplayNames, handleGraphQlError } from "util/generalUtil";
import useAddToGardenActionList from "./useAddToGardenActionList";

export const useGardenActionList = ({
  gardenId,
  refetchGarden,
}: {
  gardenId: string;
  refetchGarden: () => void;
}): EntityAction[] => {
  const addToGardenActions = useAddToGardenActionList([gardenId]);

  const [removeFromGardenMutation] = useApolloMutation(
    REMOVE_PLANT_FROM_GARDEN,
    {
      variables: { gardenId },
    },
  );

  const removeFromGarden = async (plant: EntityResult) => {
    try {
      await removeFromGardenMutation({
        variables: { plantId: plant._id },
      });

      toast.success(
        `Removed "${getEntityDisplayNames(plant).title}" from garden`,
      );
      refetchGarden();
    } catch (error) {
      handleGraphQlError(error);
    }

    refetchGarden();
  };

  return [
    {
      label: "Remove from garden",
      Icon: FaHeartBroken,
      onClick: removeFromGarden,
    },
    ...addToGardenActions,
  ];
};

export default useGardenActionList;
