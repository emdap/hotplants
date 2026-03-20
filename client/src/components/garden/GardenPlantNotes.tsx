import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import {
  mergeMotionProps,
  MOTION_FADE_IN,
  MOTION_HEIGHT_EXPAND,
} from "designSystem/motionTransitions";
import { UPDATE_GARDEN_PLANT } from "graphqlHelpers/gardenQueries";
import { useApolloMutation } from "hooks/useQuery";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { handleGraphQlError } from "util/generalUtil";

const MOTION_FADE_EXPAND = mergeMotionProps(
  MOTION_FADE_IN,
  MOTION_HEIGHT_EXPAND,
);

const GardenPlantNotes = ({
  gardenId,
  refetchPlants,
}: {
  gardenId: string;
  refetchPlants: () => Promise<unknown>;
}) => {
  const { activePlant } = usePlantSelectionContext();

  const [isEditable, setIsEditable] = useState(false);
  const [plantNotes, setPlantNotes] = useState(activePlant?.notes ?? "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [updatePlantMutation, { loading }] = useApolloMutation(
    UPDATE_GARDEN_PLANT,
    { variables: { gardenId } },
  );

  useEffect(() => {
    if (isEditable) {
      textAreaRef.current?.focus();
    }
  }, [isEditable]);

  const cancelEditing = () => {
    setIsEditable(false);
    setPlantNotes(activePlant?.notes ?? "");
  };

  const updatePlant = async () => {
    if (!activePlant) {
      setIsEditable(false);
      return;
    }

    try {
      await updatePlantMutation({
        variables: { plantId: activePlant._id, notes: plantNotes },
      });

      // Only await before clearing edit state if plant had no notes previously, prevent UI/button flicker
      if (!activePlant.notes) {
        await refetchPlants();
      } else {
        refetchPlants();
      }

      setIsEditable(false);
    } catch (error) {
      handleGraphQlError(error, {
        action: (
          <Button variant="text" size="flush" onClick={() => updatePlant()}>
            Click here to retry.
          </Button>
        ),
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h5 className="flex items-center justify-between">
        Plant Notes
        {activePlant?.notes && (
          <Button
            size="small"
            variant={isEditable ? "icon-primary" : "icon-white"}
            icon={<MdEdit />}
            onClick={() => setIsEditable(!isEditable)}
          />
        )}
      </h5>
      {activePlant?.notes || isEditable ? (
        <textarea
          ref={textAreaRef}
          className={classNames(
            "mx-1 styled-input h-[unset] bg-default-background/80 focus:bg-default-background/90 field-sizing-content max-h-40",
            {
              "ring-accent/20 ring-offset-transparent": !isEditable,
            },
          )}
          value={plantNotes}
          readOnly={!isEditable}
          onDoubleClick={() => setIsEditable(true)}
          onChange={({ target }) => setPlantNotes(target.value)}
          onKeyUp={(e) => {
            if (e.code === "Escape") {
              e.stopPropagation();
              cancelEditing();
            }
          }}
        />
      ) : (
        <Button
          variant="accent"
          className="w-fit"
          size="small"
          onClick={() => setIsEditable(true)}
        >
          Add Notes
        </Button>
      )}
      <AnimatePresence>
        {isEditable && (
          <motion.footer
            key="footer"
            className="flex gap-2 [&_button]:min-h-max [&_button]:w-40"
            {...MOTION_FADE_EXPAND}
          >
            <Button
              disabled={loading}
              variant="secondary"
              onClick={cancelEditing}
            >
              Cancel
            </Button>

            <Button
              disabled={Boolean(!activePlant?.notes && !plantNotes.length)}
              isLoading={loading}
              variant="primary"
              onClick={updatePlant}
            >
              Save
            </Button>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GardenPlantNotes;
