import { usePlantSearchContext } from "contexts/PlantSearchContext";
import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { useApolloMutation } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const PlantImage = ({
  plantId,
  occurrenceId,
  mediaObject,
}: {
  plantId: string;
  occurrenceId: number;
  mediaObject: PlantMedia;
}) => {
  const { syncPlant } = usePlantSearchContext();
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      setHideImage(true);
      await getProxyUrlMutation();
      syncPlant(plantId);
    } else {
      setImageNotAvailable(true);
    }
  };

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setImageNotAvailable(true);
    }
  }, [error]);

  return imageNotAvailable ? null : (
    <div className="relative h-full w-full flex justify-center">
      <img
        src={hideImage ? undefined : mediaObject.url}
        className="max-h-full self-center"
        onLoad={() => setIsLoading(false)}
        onError={handleImgError}
      />
      {isLoading && (
        <div className="absolute top-0 left-0 h-full w-full bg-secondary/20 flex items-center justify-center">
          <FaSpinner className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PlantImage;
