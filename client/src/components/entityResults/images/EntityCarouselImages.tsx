import { FlattenedMedia } from "contexts/entitySelection/EntitySelectionContext";
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
  | FlattenedMedia[number];

type EntityCarouselImagesProps = {
  entityId: string;
  thumbnailUrl?: string | null;
  entityMedia: FlattenedMedia;
  includeThumbnail: boolean;
  setIncludeThumbnail: (includeThumbnail: boolean) => void;
};

const EntityCarouselImages = ({
  entityId,
  thumbnailUrl,
  entityMedia,
  includeThumbnail,
  setIncludeThumbnail,
}: EntityCarouselImagesProps) => {
  const imageList = (
    (includeThumbnail && thumbnailUrl
      ? [{ isThumbnail: true, url: thumbnailUrl }]
      : []) as CarouselImage[]
  ).concat(entityMedia);

  const EntityImages = imageList.map((data) =>
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
        entityId={entityId}
        occurrenceId={data.occurrenceId}
        mediaObject={data}
        {...DEFAULT_IMAGE_PROPS}
      />
    ),
  );

  return { imageList, EntityImages };
};

export default EntityCarouselImages;
