import { FlattenedPlantMedia } from "contexts/plantSelection/PlantSelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";
import EntityOccurrenceImage from "./EntityOccurrenceImage";

const CONTAINER_CLASS = "w-full h-full flex justify-center";

const DEFAULT_IMAGE_PROPS: Partial<ImageWrapperProps> = {
  showSpinner: true,
  showSpinnerBg: false,
  imageClass: "max-h-full self-center",
};

type CarouselImage =
  | { isThumbnail: true; url: string }
  | FlattenedPlantMedia[number];

type EntityCarouselImagesProps = {
  plantId: string;
  thumbnailUrl?: string | null;
  plantMedia: FlattenedPlantMedia;
  includeThumbnail: boolean;
  setIncludeThumbnail: (includeThumbnail: boolean) => void;
};

const EntityCarouselImages = ({
  plantId,
  thumbnailUrl,
  plantMedia,
  includeThumbnail,
  setIncludeThumbnail,
}: EntityCarouselImagesProps) => {
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
      <EntityOccurrenceImage
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

export default EntityCarouselImages;
