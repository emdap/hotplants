import type { paths } from "generated/schemas/nominatim";
import { useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useState } from "react";
import { useDebounce } from "react-use";
import {
  LocationWithBoundingBox,
  validateLocationData,
} from "schemaHelpers/schemaTypesUtil";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

const LOCATION_DEFAULT_PARAMS = {
  format: "json",
  addressdetails: 1,
  polygon_geojson: 1,
  polygon_threshold: 0.5,
} as const;

const LocationSearch = ({
  setLocation,
}: {
  setLocation: (location?: LocationWithBoundingBox) => void;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  useDebounce(() => setDebouncedInput(searchInput), 2000, [searchInput]);

  const locationResult = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    queryFn: async () => {
      if (!debouncedInput) {
        setLocation();
        return "";
      }

      const { data } = await locationClient.GET("/search", {
        params: {
          query: {
            q: debouncedInput,
            ...LOCATION_DEFAULT_PARAMS,
          },
        },
      });

      const validLocation = validateLocationData(data?.[0]);

      if (!validLocation) {
        setLocation();
        return "Cannot find location";
      }

      setLocation(validLocation);
      return validLocation.display_name;
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <input
        value={searchInput}
        onBlur={() => setDebouncedInput(searchInput)}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter a location"
      />
      {locationResult.data && locationResult.data}
      {locationResult.isLoading && "Loading"}
      {locationResult.isError && "Error"}
    </div>
  );
};

export default LocationSearch;
