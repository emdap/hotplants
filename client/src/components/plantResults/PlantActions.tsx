import {
  PlantAction,
  PlantResult,
  usePlantSelectionContext,
} from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import LoadingIcon from "designSystem/LoadingIcon";
import StyledMenu, { MenuItemData } from "designSystem/StyledMenu";
import { useCallback, useMemo, useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { MdOutlineMoreVert } from "react-icons/md";

const PlantActions = ({
  plant,
  disableDefaultActions,
}: {
  plant: PlantResult;
  disableDefaultActions?: boolean;
}) => {
  const { plantActions } = usePlantSelectionContext();
  const [hasLoadingAction, setHasLoadingAction] = useState(false);

  const defaultPlantActions = useMemo(
    (): MenuItemData[] =>
      disableDefaultActions
        ? []
        : [
            {
              label: "Find more occurrences",
              Icon: FaLeaf,
              linkProps: {
                to: "/plant-search",
                search: { plantName: { scientificName: plant.scientificName } },
              },
            },
          ],
    [plant.scientificName, disableDefaultActions],
  );

  const handlePlantClick = useCallback(
    async (action: PlantAction) => {
      if (action.onClick) {
        setHasLoadingAction(true);
        await action.onClick(plant);
        setHasLoadingAction(false);
      }
    },
    [plant],
  );

  const mappedPlantActions = useMemo(
    (): MenuItemData[] =>
      plantActions
        ? plantActions.map((action) => ({
            ...action,
            onClick: () => handlePlantClick(action),
          }))
        : [],
    [plantActions, handlePlantClick],
  );

  const fullActions = useMemo(
    () =>
      mappedPlantActions.length || defaultPlantActions.length
        ? mappedPlantActions.concat(defaultPlantActions)
        : null,
    [mappedPlantActions, defaultPlantActions],
  );

  return fullActions ? (
    <StyledMenu
      items={fullActions}
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
