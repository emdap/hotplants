import ImageWrapper, {
  ImageWrapperProps,
} from "components/designSystem/ImageWrapper";
import PlantOccurrenceImage from "components/plantImages/PlantOccurrenceImage";
import { PlantResult } from "graphqlHelpers/plantQueries";

const CONTAINER_CLASS = "w-full h-full flex justify-center";

const DEFAULT_IMAGE_PROPS: Partial<ImageWrapperProps> = {
  showSpinner: true,
  showSpinnerBg: false,
  imageClass: "max-h-full self-center",
};

const PlantCarouselImages = ({
  plant,
  includeThumbnail,
  setIncludeThumbnail,
}: {
  plant: Pick<PlantResult, "occurrences" | "thumbnailUrl" | "_id">;
  includeThumbnail: boolean;
  setIncludeThumbnail: (includeThumbnail: boolean) => void;
}) => {
  const baseArray = includeThumbnail
    ? [
        <ImageWrapper
          key="thumbnail"
          imageUrl={plant.thumbnailUrl!}
          className={CONTAINER_CLASS}
          onError={() => setIncludeThumbnail(false)}
          {...DEFAULT_IMAGE_PROPS}
        />,
      ]
    : [];

  const occurrenceImages = plant.occurrences.flatMap(
    ({ occurrenceId, media }) =>
      media.map((mediaObject, index) => (
        <PlantOccurrenceImage
          key={index}
          plantId={plant._id}
          containerClass={CONTAINER_CLASS}
          {...{
            occurrenceId,
            mediaObject,
            ...DEFAULT_IMAGE_PROPS,
          }}
        />
      ))
  );

  return baseArray.concat(occurrenceImages);
};

export default PlantCarouselImages;
