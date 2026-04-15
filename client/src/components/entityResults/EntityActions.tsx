import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
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

const EntityActions = ({
  entity,
  disableDefaultActions,
}: {
  entity: PlantResult;
  disableDefaultActions?: boolean;
}) => {
  const { entityType } = usePlantSearchContext();
  const { plantActions } = usePlantSelectionContext();
  const [hasLoadingAction, setHasLoadingAction] = useState(false);

  const defaultActions = useMemo(
    (): MenuItemData[] =>
      disableDefaultActions
        ? []
        : [
            {
              label: "Find more occurrences",
              Icon: FaLeaf,
              linkProps: {
                to:
                  entityType === "plant" ? "/browse-plants" : "/browse-animals",
                search: {
                  entityName: entity.commonNames?.length
                    ? { commonName: entity.commonNames[0] }
                    : { scientificName: entity.scientificName },
                },
              },
            },
          ],
    [
      entityType,
      entity.commonNames,
      entity.scientificName,
      disableDefaultActions,
    ],
  );

  const handleActionClick = useCallback(
    async (action: PlantAction) => {
      if (action.onClick) {
        setHasLoadingAction(true);
        await action.onClick(entity);
        setHasLoadingAction(false);
      }
    },
    [entity],
  );

  const mappedActions = useMemo(
    (): MenuItemData[] =>
      plantActions
        ? plantActions.map((action) => ({
            ...action,
            onClick: () => handleActionClick(action),
          }))
        : [],
    [plantActions, handleActionClick],
  );

  const fullActions = useMemo(
    () =>
      mappedActions.length || defaultActions.length
        ? mappedActions.concat(defaultActions)
        : null,
    [mappedActions, defaultActions],
  );

  return fullActions ? (
    <StyledMenu
      items={fullActions}
      anchor="bottom end"
      itemsAsCard
      disabled={hasLoadingAction}
      className={{ menuItemsList: "z-50" }}
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

export default EntityActions;
