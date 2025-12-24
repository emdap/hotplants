import classNames from "classnames";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import PlantCarouselImages from "./PlantCarouselImages";

const PlantImageViewer = ({
  plant,
  mode,
  isModalOpen,
  setIsModalOpen,
}: {
  plant: PlantResult;
  mode: "thumbnail" | "carousel";
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { activeMediaIndex, setActiveMediaIndex } = usePlantSelectionContext();
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(
    activeMediaIndex ?? 0
  );
  const [includeThumbnail, setIncludeThumbnail] = useState(
    Boolean(plant.thumbnailUrl)
  );

  const carouselIndex = activeMediaIndex ?? 0;

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
          enableKeyboardEvents={!isModalOpen}
          carouselIndex={carouselIndex}
          setCarouselIndex={setActiveMediaIndex}
        >
          {PlantImages}
        </Carousel>
      )}
      {mode === "carousel" && (
        <Button
          variant="secondary"
          className="absolute top-0 right-0"
          onClick={() => setIsModalOpen(true)}
          size="small"
        >
          <MdFullscreen size={24} />
        </Button>
      )}

      <Modal
        title={capitalize(plant.commonNames?.[0] ?? plant.scientificName)}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveMediaIndex(largeCarouselIndex);
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
