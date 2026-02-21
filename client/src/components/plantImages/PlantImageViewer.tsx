import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import { getPlantDisplayNames } from "util/plantUtil";
import PlantCarouselImages from "./PlantCarouselImages";

const PlantImageViewer = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { activePlant, activePlantMedia, activeMediaUrl, setActiveMediaUrl } =
    usePlantSelectionContext();

  const [includeThumbnail, setIncludeThumbnail] = useState(
    Boolean(activePlant?.thumbnailUrl),
  );

  const { imageList, PlantImages } = useMemo(
    () =>
      activePlant?._id
        ? PlantCarouselImages({
            plantId: activePlant._id,
            thumbnailUrl: activePlant.thumbnailUrl,
            plantMedia: activePlantMedia,
            includeThumbnail,
            setIncludeThumbnail,
          })
        : { imageList: null, PlantImages: null },
    [
      activePlant?._id,
      activePlant?.thumbnailUrl,
      activePlantMedia,
      includeThumbnail,
    ],
  );

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(carouselIndex);

  const activeMediaIndex = useMemo(
    () =>
      // This is sloppy -- imageList shrinks if the thumbnail is kicked out, but then the activeMediaUrl is still set to the thumbnail
      Math.max(
        0,
        imageList?.findIndex(({ url }) => url === activeMediaUrl) ?? 0,
      ),
    [activeMediaUrl, imageList],
  );

  useEffect(() => {
    setCarouselIndex(activeMediaIndex);
  }, [activeMediaIndex]);

  useEffect(() => {
    if (imageList) {
      setLargeCarouselIndex(carouselIndex);
      setActiveMediaUrl(imageList[carouselIndex].url);
    }
  }, [carouselIndex, imageList, setActiveMediaUrl]);

  return (
    activePlant &&
    PlantImages && (
      <>
        <div className="aspect-square h-70 flex-col relative">
          <Carousel
            enableKeyboardEvents={!isModalOpen}
            carouselIndex={carouselIndex}
            setCarouselIndex={setCarouselIndex}
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
          {...getPlantDisplayNames(activePlant)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCarouselIndex(largeCarouselIndex);
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
    )
  );
};

export default PlantImageViewer;
