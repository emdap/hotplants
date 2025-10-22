import { PlantMedia } from "generated/graphql/graphql";
import { REPLACE_WITH_PROXY_URL } from "graphqlHelpers/plantQueries";
import { useApolloMutation } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const PlantImage = ({
  plantId,
  mediaObject,
}: {
  plantId: string;
  mediaObject: PlantMedia;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [usingProxyUrl, setUsingProxyUrl] = useState(mediaObject.isProxyUrl);
  const [imageUrl, setImageUrl] = useState<string | undefined>(mediaObject.url);
  const [imageNotAvailable, setImageNotAvailable] = useState(false);

  const [getProxyUrlMutation, { data, error }] = useApolloMutation(
    REPLACE_WITH_PROXY_URL,
    {
      variables: { plantId, replaceUrl: mediaObject.url },
    }
  );

  const handleImgError = () => {
    if (!usingProxyUrl) {
      setIsLoading(true);
      setUsingProxyUrl(true);
      setImageUrl(undefined);
      getProxyUrlMutation();
    } else {
      setImageNotAvailable(true);
    }
  };

  useEffect(() => {
    if (data?.replaceWithProxyUrl) {
      setImageUrl(data.replaceWithProxyUrl);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setImageNotAvailable(true);
    }
  }, [error]);

  return imageNotAvailable ? null : (
    <div className="relative h-full w-full flex justify-center">
      <img
        src={imageUrl}
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
