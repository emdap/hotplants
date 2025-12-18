import classNames from "classnames";
import {
  HTMLProps,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageNotAvailable, setImageNotAvailable] = useState(false);

  const handleLoadError = () => {
    setIsLoaded(false);
    setImageNotAvailable(true);

    onError && onError();
  };

  useEffect(() => {
    setIsLoaded(false);
    imageUrl && setImageNotAvailable(false);
  }, [imageUrl]);

  useLayoutEffect(() => {
    imgRef.current?.complete && setIsLoaded(true);
  }, [imageUrl]);

  return imageNotAvailable ? (
    children({ isLoaded, isError: true })
  ) : (
    <div
      className={classNames(showSpinner && "relative", containerClass)}
      {...containerProps}
    >
      <img
        ref={imgRef}
        loading="lazy"
        src={imageUrl}
        className={classNames(
          imageClass,

          ["transition-opacity", isLoaded ? "opacity-100" : "opacity-0"]
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleLoadError}
      />
      {showSpinner && !isLoaded && (
        <div
          className={classNames(
            "absolute top-0 left-0 h-full w-full  flex items-center justify-center text-primary",
            { "bg-secondary/20": showSpinnerBg }
          )}
        >
          <LoadingIcon />
        </div>
      )}
      {children({ isLoaded })}
    </div>
  );
};

export default ImageWrapper;
