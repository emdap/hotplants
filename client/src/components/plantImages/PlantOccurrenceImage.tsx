import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import ImageWrapper, { ImageWrapperProps } from "designSystem/ImageWrapper";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useApolloMutation } from "hooks/useQuery";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { elementInViewport } from "util/generalUtil";

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
  const [renderImage, setRenderImage] = useState(true);
  // const [imageNotAvailable, setImageNotAvailable] = useState(false);
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
    if (!renderImage) {
      return undefined;
    } else if (useThumbnail && thumbnailUrl) {
      return thumbnailUrl;
    } else {
      return mediaObject.url;
    }
  }, [renderImage, thumbnailUrl, mediaObject.url, useThumbnail]);

  const { scrollContainer } = useGetScrollContainer();

  useLayoutEffect(() => {
    const checkImageInViewport = () => {
      // TODO: Arbitrary delay to wait for container to finish rendering
      setTimeout(() => {
        if (plantImageRef.current) {
          const shouldRenderImage = elementInViewport(plantImageRef.current, {
            yBuffer: 2,
          });
          setRenderImage(shouldRenderImage);
        }
      }, 1000);
    };

    checkImageInViewport();
    scrollContainer?.addEventListener("scroll", checkImageInViewport);

    return () =>
      scrollContainer?.removeEventListener("scroll", checkImageInViewport);
  }, [scrollContainer]);

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
