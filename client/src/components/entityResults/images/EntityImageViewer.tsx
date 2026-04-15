import { useEntitySelectionContext } from "contexts/entitySelection/EntitySelectionContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal from "designSystem/Modal";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";
import { getEntityDisplayNames } from "util/generalUtil";
import EntityCarouselImages from "./EntityCarouselImages";

const EntityImageViewer = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { activeEntity, activeEntityMedia, activeMediaUrl, setActiveMediaUrl } =
    useEntitySelectionContext();

  const [includeThumbnail, setIncludeThumbnail] = useState(
    Boolean(activeEntity?.thumbnailUrl),
  );

  const { imageList, EntityImages } = useMemo(
    () =>
      activeEntity?._id
        ? EntityCarouselImages({
            entityId: activeEntity._id,
            thumbnailUrl: activeEntity.thumbnailUrl,
            entityMedia: activeEntityMedia,
            includeThumbnail,
            setIncludeThumbnail,
          })
        : { imageList: null, EntityImages: null },
    [
      activeEntity?._id,
      activeEntity?.thumbnailUrl,
      activeEntityMedia,
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
    activeEntity &&
    EntityImages && (
      <>
        <div className="aspect-square h-70 flex-col relative">
          <Carousel
            enableKeyboardEvents={!isModalOpen}
            carouselIndex={carouselIndex}
            setCarouselIndex={setCarouselIndex}
            childrenWrapperProps={{ onDoubleClick: () => setIsModalOpen(true) }}
          >
            {EntityImages}
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
          {...getEntityDisplayNames(activeEntity)}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCarouselIndex(largeCarouselIndex);
          }}
          className="h-5/6"
        >
          <Carousel
            carouselIndex={carouselIndex}
            setCarouselIndex={setLargeCarouselIndex}
            bigButtons
            enableKeyboardEvents
          >
            {EntityImages}
          </Carousel>
        </Modal>
      </>
    )
  );
};

export default EntityImageViewer;
