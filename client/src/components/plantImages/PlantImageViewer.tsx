import classNames from "classnames";
import Button from "components/designSystem/Button";
import Carousel from "components/designSystem/Carousel";
import Modal from "components/designSystem/Modal";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import PlantCarouselImages from "./PlantCarouselImages";

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
  const [includeThumbnail, setIncludeThumbnail] = useState(
    Boolean(plant.thumbnailUrl)
  );

  const carouselIndex = activeIndexes.mediaIndex ?? 0;

  const PlantImages = useMemo(
    () =>
      PlantCarouselImages({
        plant: {
          occurrences: plant.occurrences,
          thumbnailUrl: plant.thumbnailUrl,
          _id: plant._id,
        },
        includeThumbnail,
        setIncludeThumbnail,
      }),
    [plant.occurrences, plant.thumbnailUrl, plant._id, includeThumbnail]
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
        PlantImages[0]
      ) : (
        <Carousel
          enableKeyboardEvents={!fullScreenElement}
          carouselIndex={carouselIndex}
          setCarouselIndex={syncActiveMediaIndex}
        >
          {PlantImages}
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
          {PlantImages}
        </Carousel>
      </Modal>
    </div>
  );
};

export default PlantImageViewer;
