import {
  PlantAction,
  usePlantSelectionContext,
} from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import LoadingIcon from "designSystem/LoadingIcon";
import StyledMenu from "designSystem/StyledMenu";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useCallback, useMemo, useState } from "react";
import { MdOutlineMoreVert } from "react-icons/md";

const PlantActions = ({ plant }: { plant: PlantResult }) => {
  const { plantActions } = usePlantSelectionContext();
  const [hasLoadingAction, setHasLoadingAction] = useState(false);

  const handlePlantClick = useCallback(
    async (action: PlantAction) => {
      setHasLoadingAction(true);
      await (action.onClick && action.onClick(plant));
      setHasLoadingAction(false);
    },
    [plant],
  );

  const mappedPlantActions = useMemo(
    () =>
      plantActions?.map((action) => ({
        ...action,
        onClick: () => handlePlantClick(action),
      })),
    [plantActions, handlePlantClick],
  );

  return plantActions?.length ? (
    <StyledMenu
      items={mappedPlantActions}
      anchor="bottom end"
      itemsAsCard
      disabled={hasLoadingAction}
      menuButton={
        <Button
          variant="icon-white"
          size="small"
          icon={hasLoadingAction ? <LoadingIcon /> : <MdOutlineMoreVert />}
        />
      }
    />
  ) : null;
};

export default PlantActions;
