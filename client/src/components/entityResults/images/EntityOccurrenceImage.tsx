import { useEntitySelectionContext } from "contexts/entitySelection/EntitySelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/entityQueries";
import { useApolloMutation } from "hooks/useQuery";
import { useMemo, useRef, useState } from "react";

export type EntityOccurrenceImageProps = Omit<
  ImageWrapperProps,
  "onError" | "imageUrl"
> & {
  entityId: string;
  thumbnailUrl?: string | null;
  occurrenceId: number;
  mediaObject: PlantMedia;
  containerClass?: string;
};

/** Uses thumbnailUrl if it's provided, otherwise uses the PlantMedia object */
const EntityOccurrenceImage = ({
  entityId,
  thumbnailUrl,
  occurrenceId,
  mediaObject,
  containerClass,
  ...imageWrapperProps
}: EntityOccurrenceImageProps) => {
  const entityImageRef = useRef<HTMLDivElement>(null);
  const { syncEntity } = useEntitySelectionContext();
  const [useThumbnail, setUseThumbnail] = useState(Boolean(thumbnailUrl));

  const [getProxyUrlMutation] = useApolloMutation(REPLACE_WITH_PROXY_URL, {
    variables: { entityId, occurrenceId, replaceUrl: mediaObject.url },
  });

  const handleImgError = async () => {
    if (useThumbnail) {
      setUseThumbnail(false);
    } else if (!mediaObject.isProxyUrl) {
      await getProxyUrlMutation();
      syncEntity(entityId);
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
      ref={entityImageRef}
      className={containerClass}
      imageUrl={imageUrl}
      onError={handleImgError}
      {...imageWrapperProps}
    />
  );
};

export default EntityOccurrenceImage;
