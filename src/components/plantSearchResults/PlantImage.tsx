import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import LoadingIcon from "designSystem/LoadingIcon";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { elementInViewport, getScrollParent } from "helpers/generalUtil";
import { useApolloMutation } from "hooks/useQuery";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

const PlantImage = ({
  plantId,
  occurrenceId,
  mediaObject,
  showSpinner,
  containerClass,
  imageClass,
  children = () => null,
}: {
  plantId: string;
  occurrenceId: number;
  mediaObject: PlantMedia;
  showSpinner?: boolean;
  containerClass?: string;
  imageClass?: string;
  children?: (data: { isLoaded: boolean }) => ReactNode;
}) => {
  const plantImageRef = useRef<HTMLDivElement>(null);
  const { syncPlant } = usePlantSearchContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hideImage, setHideImage] = useState(false);
  const [imageNotAvailable, setImageNotAvailable] = useState(false);

  const [getProxyUrlMutation, { error }] = useApolloMutation(
    REPLACE_WITH_PROXY_URL,
    {
      variables: { plantId, occurrenceId, replaceUrl: mediaObject.url },
    }
  );

  useEffect(() => {
    setHideImage(false);
  }, [mediaObject.url]);

  const handleImgError = async () => {
    if (!mediaObject.isProxyUrl) {
      setIsLoaded(true);
      setHideImage(true);
      await getProxyUrlMutation();
      syncPlant(plantId);
    } else {
      setImageNotAvailable(true);
    }
  };

  useEffect(() => {
    if (error) {
      setIsLoaded(false);
      setImageNotAvailable(true);
    }
  }, [error]);

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

    const parentElement = getScrollParent(plantImageRef.current);
    parentElement?.addEventListener("scroll", imageInViewport);

    return () => parentElement?.removeEventListener("scroll", imageInViewport);
  }, [isLoaded]);

  return imageNotAvailable ? (
    children({ isLoaded })
  ) : (
    <div
      ref={plantImageRef}
      className={classNames(showSpinner && "relative", containerClass)}
    >
      <img
        loading="lazy"
        src={hideImage ? undefined : mediaObject.url}
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
