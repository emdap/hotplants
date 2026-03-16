import {
  PlantAction,
  PlantResult,
} from "contexts/plantSelection/PlantSelectionContext";
import { REMOVE_PLANT_FROM_GARDEN } from "graphqlHelpers/gardenQueries";
import { useApolloMutation } from "hooks/useQuery";
import { FaHeartBroken } from "react-icons/fa";
import { toast } from "sonner";
import { handleGraphQlError } from "util/generalUtil";
import { getPlantDisplayNames } from "util/plantUtil";
import { defaultWarningToast } from "util/toastUtil";

export const useGardenActionList = ({
  gardenId,
  refetchGarden,
}: {
  gardenId: string;
  refetchGarden: () => void;
}): PlantAction[] => {
  const [removeFromGardenMutation] = useApolloMutation(
    REMOVE_PLANT_FROM_GARDEN,
    {
      variables: { gardenId },
    },
  );

  const removeFromGarden = async (plant: PlantResult) => {
    try {
      const data = await removeFromGardenMutation({
        variables: { plantId: plant._id },
      });
      if (!data.error) {
        toast.success(
          `Removed "${getPlantDisplayNames(plant).title}" from garden"`,
        );
      } else {
        defaultWarningToast();
      }
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
  ];
};

export default useGardenActionList;
