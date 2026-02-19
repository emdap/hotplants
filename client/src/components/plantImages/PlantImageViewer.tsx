import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import { getPlantDisplayName } from "util/generalUtil";
import PlantCarouselImages from "./PlantCarouselImages";

const PlantImageViewer = ({
  plant,
  isModalOpen,
  setIsModalOpen,
}: {
  plant: PlantResult;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { activeMediaIndex, setActiveMediaIndex } = usePlantSelectionContext();
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(0);
  const [includeThumbnail, setIncludeThumbnail] = useState(
    Boolean(plant.thumbnailUrl),
  );

  const carouselIndex = activeMediaIndex ?? 0;
  useEffect(() => {
    setLargeCarouselIndex(carouselIndex);
  }, [carouselIndex]);

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
    [plant.occurrences, plant.thumbnailUrl, plant._id, includeThumbnail],
  );

  return (
    <>
      <div className="aspect-square h-70 flex-col relative">
        <Carousel
          enableKeyboardEvents={!isModalOpen}
          carouselIndex={carouselIndex}
          setCarouselIndex={setActiveMediaIndex}
          childrenWrapperProps={{ onDoubleClick: () => setIsModalOpen(true) }}
        >
          {PlantImages}
        </Carousel>

        <Button
          variant="secondary"
          className="absolute top-0 right-0"
          onClick={() => setIsModalOpen(true)}
          size="small"
          icon={<MdFullscreen size={24} />}
        />
      </div>

      <Modal
        title={getPlantDisplayName(plant)}
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
    </>
  );
};

export default PlantImageViewer;
