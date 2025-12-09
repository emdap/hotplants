import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { elementInViewport } from "helpers/generalUtil";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { useApolloMutation } from "hooks/useQuery";
import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type PlantImageProps = {
  plantId: string;
  thumbnailUrl?: string | null;
  occurrenceId: number;
  mediaObject: PlantMedia;
  showSpinner?: boolean;
  containerClass?: string;
  imageClass?: string;
  children?: (data: { isLoaded: boolean }) => ReactNode;
};

/** Uses thumbnailUrl if it's provided, otherwise uses the PlantMedia object */
const PlantImage = ({
  plantId,
  thumbnailUrl,
  occurrenceId,
  mediaObject,
  showSpinner,
  containerClass,
  imageClass,
  children = () => null,
}: PlantImageProps) => {
  const plantImageRef = useRef<HTMLDivElement>(null);
  const { syncPlant } = usePlantSearchContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const [imageNotAvailable, setImageNotAvailable] = useState(false);
  const [useThumbnail, setUseThumbnail] = useState(Boolean(thumbnailUrl));

  const [getProxyUrlMutation, { error }] = useApolloMutation(
    REPLACE_WITH_PROXY_URL,
    {
      variables: { plantId, occurrenceId, replaceUrl: mediaObject.url },
    }
  );

  useEffect(() => {
    setHideImage(false);
  }, [thumbnailUrl, mediaObject.url]);

  const handleImgError = async () => {
    if (!useThumbnail && mediaObject.isProxyUrl) {
      setImageNotAvailable(true);
    } else {
      setIsLoaded(false);
      setHideImage(true);

      if (useThumbnail) {
        setUseThumbnail(false);
      } else if (!mediaObject.isProxyUrl) {
        await getProxyUrlMutation();
        syncPlant(plantId);
      }
    }
  };

  const imgSrc = useMemo(() => {
    if (hideImage) {
      return undefined;
    } else if (useThumbnail && thumbnailUrl) {
      return thumbnailUrl;
    } else {
      return mediaObject.url;
    }
  }, [hideImage, thumbnailUrl, mediaObject.url, useThumbnail]);

  useEffect(() => {
    if (error) {
      setIsLoaded(false);
      setImageNotAvailable(true);
    }
  }, [error]);

  const { scrollContainer } = useGetScrollContainer();

  useLayoutEffect(() => {
    const imageInViewport = () => {
      if (!plantImageRef.current) {
        return;
      }

      const shouldRenderImage = elementInViewport(plantImageRef.current, {
        yBuffer: 2,
      });

      if (!shouldRenderImage && isLoaded) {
        setHideImage(true);
        setIsLoaded(false);
      } else if (shouldRenderImage) {
        setHideImage(false);
      }
    };

    scrollContainer?.addEventListener("scroll", imageInViewport);

    return () =>
      scrollContainer?.removeEventListener("scroll", imageInViewport);
  }, [isLoaded, scrollContainer]);

  return imageNotAvailable ? (
    children({ isLoaded })
  ) : (
    <div
      ref={plantImageRef}
      className={classNames(showSpinner && "relative", containerClass)}
    >
      <img
        loading="lazy"
        src={imgSrc}
        className={classNames(
          imageClass,

          ["transition-opacity", isLoaded ? "opacity-100" : "opacity-0"]
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleImgError}
      />

      {showSpinner && !isLoaded && (
        <div className="absolute top-0 left-0 h-full w-full bg-secondary/20 flex items-center justify-center text-primary">
          <LoadingIcon />
        </div>
      )}

      {children({ isLoaded })}
    </div>
  );
};

export default PlantImage;
