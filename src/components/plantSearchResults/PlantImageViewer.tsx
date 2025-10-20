import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Carousel from "designSystem/Carousel";
import Modal, { ModalProps } from "designSystem/Modal";
import { PlantResult } from "graphqlHelpers/plantQueries";
import { useEffect, useMemo, useState } from "react";
import { MdFullscreen } from "react-icons/md";

const PlantImageViewer = ({
  plant,
  mode,
  parentRef,
}: {
  plant: PlantResult;
  mode: "thumbnail" | "carousel";
} & Pick<ModalProps, "parentRef">) => {
  const {
    fullScreenElementState: [fullScreenElement, setFullScreenElement],
  } = usePlantSearchContext();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [largeCarouselIndex, setLargeCarouselIndex] = useState(0);

  const plantImages = useMemo(
    () => plant.mediaUrls.map((url, index) => <img key={index} src={url} />),
    [plant.mediaUrls]
  );

  useEffect(() => {
    setFullScreenElement(showFullScreen ? "IMAGE_VIEWER" : null);
  }, [showFullScreen, setFullScreenElement]);

  return (
    <div
      className={classNames("aspect-square flex justify-center p-0!", {
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
        parentRef={parentRef}
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
