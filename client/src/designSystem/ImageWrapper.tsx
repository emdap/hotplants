import classNames from "classnames";
import imageNotAvailable from "imageAssets/imageNotAvailable.png";
import { HTMLProps, ReactNode, useEffect, useRef, useState } from "react";
import LoadingIcon from "./LoadingIcon";

export type ImageWrapperProps = {
  imageUrl?: string;
  showSpinner?: boolean;
  showSpinnerBg?: boolean;
  imageClass?: string;
  onError?: () => void;
  children?: (data: { isLoaded: boolean; isError?: boolean }) => ReactNode;
} & Omit<HTMLProps<HTMLDivElement>, "children">;

const ImageWrapper = ({
  imageUrl,
  showSpinner,
  showSpinnerBg,
  imageClass,
  onError,
  children = () => null,
  className: containerClass,
  ...containerProps
}: ImageWrapperProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLoadError = () => {
    setIsLoaded(false);
    setIsError(true);

    onError && onError();
  };

  useEffect(() => {
    setIsLoaded(Boolean(imgRef.current?.complete));
    imageUrl && setIsError(false);
  }, [imageUrl]);

  return (
    <div
      className={classNames(showSpinner && "relative", containerClass)}
      {...containerProps}
    >
      <img
        ref={imgRef}
        loading="lazy"
        src={isError ? imageNotAvailable : imageUrl}
        className={classNames(imageClass, [
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
        ])}
        onLoad={() => setIsLoaded(true)}
        onError={handleLoadError}
      />
      {showSpinner && !isLoaded && (
        <div
          className={classNames(
            "absolute top-0 left-0 h-full w-full  flex items-center justify-center text-primary",
            { "bg-secondary/20": showSpinnerBg },
          )}
        >
          <LoadingIcon />
        </div>
      )}
      {children({ isLoaded, isError })}
    </div>
  );
};

export default ImageWrapper;
