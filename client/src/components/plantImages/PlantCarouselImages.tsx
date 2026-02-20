import PlantOccurrenceImage from "components/plantImages/PlantOccurrenceImage";
import { FlattenedPlantMedia } from "contexts/plantSelection/PlantSelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";

const CONTAINER_CLASS = "w-full h-full flex justify-center";

const DEFAULT_IMAGE_PROPS: Partial<ImageWrapperProps> = {
  showSpinner: true,
  showSpinnerBg: false,
  imageClass: "max-h-full self-center",
};

type CarouselImage =
  | { isThumbnail: true; url: string }
  | FlattenedPlantMedia[number];

const PlantCarouselImages = ({
  plantId,
  thumbnailUrl,
  plantMedia,
  includeThumbnail,
  setIncludeThumbnail,
}: {
  plantId: string;
  thumbnailUrl?: string | null;
  plantMedia: FlattenedPlantMedia;
  includeThumbnail: boolean;
  setIncludeThumbnail: (includeThumbnail: boolean) => void;
}) => {
  const imageList = (
    (includeThumbnail && thumbnailUrl
      ? [{ isThumbnail: true, url: thumbnailUrl }]
      : []) as CarouselImage[]
  ).concat(plantMedia);

  const PlantImages = imageList.map((data) =>
    "isThumbnail" in data ? (
      <ImageWrapper
        key="thumbnail"
        imageUrl={data.url}
        className={CONTAINER_CLASS}
        onError={() => setIncludeThumbnail(false)}
        {...DEFAULT_IMAGE_PROPS}
      />
    ) : (
      <PlantOccurrenceImage
        key={data.url}
        containerClass={CONTAINER_CLASS}
        plantId={plantId}
        occurrenceId={data.occurrenceId}
        mediaObject={data}
        {...DEFAULT_IMAGE_PROPS}
      />
    ),
  );

  return { imageList, PlantImages };
};

export default PlantCarouselImages;
