import classNames from "classnames";
import {
  FILTER_HOLDER_ID,
  usePlantSearchContext,
} from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import type { paths } from "generated/schemas/nominatim";
import { validateNominatimLocation } from "helpers/schemaTypesUtil";
import { useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { useDebounce } from "react-use";

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
  const { searchLocation, setSearchLocation, setSearchLocationLoading } =
    usePlantSearchContext();

  const [enableQuery, setEnableQuery] = useState(
    searchLocation?.locationSource !== "map"
  );
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState<string | null>(null);
  const [locationInvalid, setLocationInvalid] = useState(false);

  useDebounce(
    () =>
      (debouncedInput !== null || searchInput) &&
      setDebouncedInput(searchInput),
    1000,
    [searchInput]
  );

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
    enabled: enableQuery && debouncedInput !== null,
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

  useEffect(() => {
    setSearchLocationLoading(locationQuery.isLoading);
  }, [setSearchLocationLoading, locationQuery.isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  return (
    <div className="flex flex-col pl-2 pr-4 w-full overflow-auto">
      <div className="form-item flex-row items-center">
        <label htmlFor="search-location">Location</label>
        <input
          id="search-location"
          value={searchInput}
          className={classNames(
            "w-full",
            (locationQuery.isError || locationInvalid) &&
              "dark:!border-red-700 ring-offset-red-500/70 !border-red-500"
          )}
          onBlur={() => setDebouncedInput(searchInput)}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setEnableQuery(true);
            setSearchInput(e.target.value);
          }}
          placeholder={
            searchLocation?.locationSource === "map"
              ? `Custom Location: (${searchLocation.displayName})`
              : "Search for a location"
          }
        />
        {searchLocation && (
          <Button
            linkAddress={`#${FILTER_HOLDER_ID}`}
            className="md:hidden sticky top-0 z-20 justify-self-end text-sm"
            variant="primary"
          >
            <MdChevronRight className="rotate-90" />
          </Button>
        )}
      </div>

      <div className="px-1 text-xs font-medium text-default-text/70">
        {locationQuery.isError
          ? "Error loading location"
          : locationInvalid && "Cannot find location"}
      </div>
    </div>
  );
};

export default LocationSearch;
