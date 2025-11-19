import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import PlantImage from "./PlantImage";

const PlantImageViewer = ({
  plant,
  mode,
}: {
  plant: PlantResult;
  mode: "thumbnail" | "carousel";
}) => {
  const {
    fullScreenElement,
    setFullScreenElement,
    activeIndexes,
    setActiveIndexes,
  } = usePlantSearchContext();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(
    activeIndexes.mediaIndex ?? 0
  );

  const carouselIndex = activeIndexes.mediaIndex ?? 0;

  const plantImages = useMemo(
    () =>
      plant.occurrences.flatMap(({ occurrenceId, media }) =>
        media.map((mediaObject, index) => (
          <PlantImage
            key={index}
            showSpinner
            imageClass="max-h-full self-center"
            containerClass="w-full h-full flex justify-center"
            plantId={plant._id}
            {...{ occurrenceId, mediaObject }}
          />
        ))
      ),
    [plant.occurrences, plant._id]
  );

  useEffect(() => {
    setFullScreenElement(showFullScreen ? "IMAGE_VIEWER" : null);
  }, [showFullScreen, setFullScreenElement]);

  const syncActiveMediaIndex = (newIndex: number) =>
    setActiveIndexes((prev) => ({ ...prev, mediaIndex: newIndex }));

  return (
    <div
      className={classNames("aspect-square", {
        "h-full": mode === "thumbnail",
        "h-70 flex-col relative": mode === "carousel",
      })}
    >
      {mode === "thumbnail" ? (
        plantImages[0]
      ) : (
        <Carousel
          enableKeyboardEvents={!fullScreenElement}
          carouselIndex={carouselIndex}
          setCarouselIndex={syncActiveMediaIndex}
        >
          {plantImages}
        </Carousel>
      )}
      {mode === "carousel" && (
        <Button
          variant="secondary"
          className="absolute top-0 right-0"
          onClick={() => setShowFullScreen(true)}
          size="small"
        >
          <MdFullscreen size={24} />
        </Button>
      )}

      <Modal
        title={capitalize(plant.commonNames?.[0] ?? plant.scientificName)}
        isOpen={showFullScreen}
        onClose={() => {
          setShowFullScreen(false);
          syncActiveMediaIndex(largeCarouselIndex);
        }}
      >
        <Carousel
          carouselIndex={carouselIndex}
          setCarouselIndex={setLargeCarouselIndex}
          bigButtons
          enableKeyboardEvents
        >
          {plantImages}
        </Carousel>
      </Modal>
    </div>
  );
};

export default PlantImageViewer;
