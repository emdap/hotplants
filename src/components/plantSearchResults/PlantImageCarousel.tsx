import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { PlantResult } from "graphqlHelpers/plantQueries";
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
  const [carouselIndex, setCarouselIndex] = useState(
    activeIndexes.mediaIndex ?? 0
  );
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(
    activeIndexes.mediaIndex ?? 0
  );

  const plantImages = useMemo(
    () =>
      plant.occurrences.flatMap(({ occurrenceId, media }) =>
        media.map((mediaObject, index) => (
          <PlantImage
            key={index}
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

  useEffect(() => {
    activeIndexes.mediaIndex !== null &&
      setCarouselIndex(activeIndexes.mediaIndex);
  }, [activeIndexes.mediaIndex]);

  useEffect(() => {
    setActiveIndexes((prev) => ({ ...prev, mediaIndex: carouselIndex }));
  }, [carouselIndex, setActiveIndexes]);

  return (
    <div
      className={classNames("aspect-square", {
        "h-full": mode === "thumbnail",
        "w-1/2 max-h-70 flex-col relative": mode === "carousel",
      })}
    >
      {mode === "thumbnail" ? (
        plantImages[0]
      ) : (
        <Carousel
          enableKeyboardEvents={!fullScreenElement}
          {...{ carouselIndex, setCarouselIndex }}
        >
          {plantImages}
        </Carousel>
      )}
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
        onClose={() => {
          setShowFullScreen(false);
          setCarouselIndex(largeCarouselIndex);
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
