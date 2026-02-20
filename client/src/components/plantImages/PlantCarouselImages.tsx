import PlantOccurrenceImage from "components/plantImages/PlantOccurrenceImage";
import { FlattenedPlantMedia } from "contexts/plantSelection/PlantSelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";
import { ReactNode } from "react";

const CONTAINER_CLASS = "w-full h-full flex justify-center";

const DEFAULT_IMAGE_PROPS: Partial<ImageWrapperProps> = {
  showSpinner: true,
  showSpinnerBg: false,
  imageClass: "max-h-full self-center",
};

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
  const baseArray =
    includeThumbnail && thumbnailUrl
      ? [
          {
            url: thumbnailUrl,
            element: (
              <ImageWrapper
                key="thumbnail"
                imageUrl={thumbnailUrl!}
                className={CONTAINER_CLASS}
                onError={() => setIncludeThumbnail(false)}
                {...DEFAULT_IMAGE_PROPS}
              />
            ),
          },
        ]
      : [];

  const occurrenceImages = plantMedia.map(
    ({ isProxyUrl, url, occurrenceId }) => ({
      url,
      element: (
        <PlantOccurrenceImage
          key={url}
          containerClass={CONTAINER_CLASS}
          {...{
            plantId,
            occurrenceId,
            mediaObject: { isProxyUrl, url },
            ...DEFAULT_IMAGE_PROPS,
          }}
        />
      ),
    }),
  );

  return baseArray
    .concat(occurrenceImages)
    .reduce<{ imageUrls: string[]; PlantImages: ReactNode[] }>(
      (prev, { url, element }) => {
        prev.imageUrls.push(url);
        prev.PlantImages.push(element);
        return prev;
      },
      { imageUrls: [], PlantImages: [] },
    );
};

export default PlantCarouselImages;
