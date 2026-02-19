import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { useApolloMutation } from "hooks/useQuery";
import { useMemo, useRef, useState } from "react";

export type PlantOccurrenceImageProps = Omit<
  ImageWrapperProps,
  "onError" | "imageUrl"
> & {
  plantId: string;
  thumbnailUrl?: string | null;
  occurrenceId: number;
  mediaObject: PlantMedia;
  containerClass?: string;
};

/** Uses thumbnailUrl if it's provided, otherwise uses the PlantMedia object */
const PlantOccurrenceImage = ({
  plantId,
  thumbnailUrl,
  occurrenceId,
  mediaObject,
  containerClass,
  ...imageWrapperProps
}: PlantOccurrenceImageProps) => {
  const plantImageRef = useRef<HTMLDivElement>(null);
  const { syncPlant } = usePlantSelectionContext();
  const [useThumbnail, setUseThumbnail] = useState(Boolean(thumbnailUrl));

  const [getProxyUrlMutation] = useApolloMutation(REPLACE_WITH_PROXY_URL, {
    variables: { plantId, occurrenceId, replaceUrl: mediaObject.url },
  });

  const handleImgError = async () => {
    if (useThumbnail) {
      setUseThumbnail(false);
    } else if (!mediaObject.isProxyUrl) {
      await getProxyUrlMutation();
      syncPlant(plantId);
    }
  };

  const imageUrl = useMemo(() => {
    if (useThumbnail && thumbnailUrl) {
      return thumbnailUrl;
    } else {
      return mediaObject.url;
    }
  }, [thumbnailUrl, mediaObject.url, useThumbnail]);

  return (
    <ImageWrapper
      ref={plantImageRef}
      className={containerClass}
      imageUrl={imageUrl}
      onError={handleImgError}
      {...imageWrapperProps}
    />
  );
};

export default PlantOccurrenceImage;
