import { usePlantSearchContext } from "contexts/PlantSearchContext";
import type { paths } from "generated/schemas/nominatim";
import { useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { validateNominatimLocation } from "schemaHelpers/schemaTypesUtil";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

const LOCATION_DEFAULT_PARAMS = {
  format: "json",
  addressdetails: 1,
  polygon_geojson: 1,
  polygon_threshold: 0.5,
} as const;

const getLocation = (input: string) =>
  locationClient.GET("/search", {
    params: {
      query: {
        ...LOCATION_DEFAULT_PARAMS,
        q: input,
      },
    },
  });

const LocationSearch = () => {
  const { searchLocation, setSearchLocation } = usePlantSearchContext();

  const [enableQuery, setEnableQuery] = useState(
    searchLocation?.locationSource !== "map"
  );
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [locationInvalid, setLocationInvalid] = useState(false);

  useDebounce(() => setDebouncedInput(searchInput), 2000, [searchInput]);

  useEffect(() => {
    if (searchLocation?.locationSource === "map") {
      setSearchInput("");
      setDebouncedInput("");
      setLocationInvalid(false);
      setEnableQuery(false);
    } else {
      setEnableQuery(true);
    }
  }, [searchLocation?.locationSource]);

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    enabled: enableQuery,
    queryFn: async () => {
      setLocationInvalid(false);

      if (debouncedInput) {
        const { data } = await getLocation(debouncedInput);
        const validLocation = validateNominatimLocation(data?.[0]);
        if (validLocation) {
          setSearchLocation(validLocation);
          return validLocation;
        } else {
          setLocationInvalid(true);
        }
      }

      setSearchLocation(null);
      return null;
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
        onChange={(e) => {
          setEnableQuery(true);
          setSearchInput(e.target.value);
        }}
        placeholder="Enter a location"
      />
      {searchLocation &&
        (searchLocation?.displayName || "Using custom location on map")}

      {locationQuery.isLoading
        ? "Loading"
        : locationQuery.isError
        ? "Error"
        : locationInvalid && "Cannot find location"}
    </div>
  );
};

export default LocationSearch;
