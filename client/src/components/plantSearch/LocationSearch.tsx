import classNames from "classnames";
import {
  FILTER_HOLDER_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import type { paths } from "generated/schemas/nominatim";
import { useReactQuery } from "hooks/useQuery";
import createClient from "openapi-fetch";
import { useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { useDebounce } from "react-use";
import { validateNominatimLocation } from "util/schemaTypesUtil";

const locationClient = createClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org",
});

const getLocation = (input: string) =>
  locationClient.GET("/search", {
    params: {
      query: {
        format: "json",
        q: input,
      },
    },
  });

const LocationSearch = ({
  setIsLoading,
}: {
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const { searchLocation, setSearchLocation } = usePlantSearchContext();

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
    setIsLoading(locationQuery.isLoading);
  }, [setIsLoading, locationQuery.isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  return (
    <div className="flex flex-col pl-2 md:pr-4 w-full overflow-auto">
      <div className="form-item flex-row items-center">
        <label htmlFor="search-location">Location</label>
        <input
          id="search-location"
          value={searchInput}
          className={classNames(
            "styled-input flex-grow min-w-20",
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
            className="md:hidden justify-self-end"
            variant="icon-primary"
            icon={<MdChevronRight className="rotate-90" size={16} />}
          />
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
