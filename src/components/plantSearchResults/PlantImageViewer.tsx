import classNames from "classnames";
import Button from "designSystem/Button";
import Modal, { ModalProps } from "designSystem/Modal";
import { PlantResult } from "graphqlQueries/plantQueries";
import { useState } from "react";
import { MdFullscreen } from "react-icons/md";

const PlantImageViewer = ({
  plant,
  mode,
  parentRef,
}: {
  plant: PlantResult;
  mode: "thumbnail" | "carousel";
} & Pick<ModalProps, "parentRef">) => {
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div
      className={classNames("aspect-square flex justify-center p-0!", {
        "h-full": mode === "thumbnail",
        "w-1/2 max-h-70 flex-col relative": mode === "carousel",
      })}
    >
      <img className="h-full" src={plant.mediaUrls[0]} />
      {mode === "carousel" && (
        <Button variant="secondary" className="absolute top-1 right-1">
          <MdFullscreen
            size={24}
            color="white"
            onClick={() => setShowFullScreen(true)}
          />
        </Button>
      )}

      <Modal
        isOpen={showFullScreen}
        onClose={() => setShowFullScreen(false)}
        parentRef={parentRef}
      />
    </div>
  );
};

export default PlantImageViewer;
