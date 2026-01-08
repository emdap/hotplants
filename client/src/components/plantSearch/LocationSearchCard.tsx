import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import {
  RESULTS_PANE_ID,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { useReactQuery } from "hooks/useQuery";
import { ReactNode, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import {
  lookupLocationInput,
  validateNominatimLocation,
} from "util/locationUtil";

const LocationSearchCard = ({ children }: { children?: ReactNode }) => {
  const {
    searchParams,
    searchParamsDraft,
    updateSearchParamsDraft,
    setSearchParamsDraft,
  } = usePlantSearchContext();

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
    if (searchParamsDraft.locationSource === "custom") {
      setLocationInvalid(false);
    }
  }, [searchParamsDraft.locationSource]);

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    enabled:
      debouncedInput !== null && searchParams?.locationName !== debouncedInput,
    queryFn: async () => {
      setLocationInvalid(false);

      if (debouncedInput) {
        const { data } = await lookupLocationInput(debouncedInput);
        const validLocation = validateNominatimLocation(data?.[0]);
        if (validLocation) {
          updateSearchParamsDraft(validLocation);
          return validLocation;
        } else {
          setLocationInvalid(true);
        }
      }

      setSearchParamsDraft(
        ({
          locationName: _l1,
          locationSource: _l2,
          boundingPolyCoords: _l3,
          ...rest
        }) => rest
      );
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
    <Card className="flex flex-col gap-2 items-start w-full !p-2">
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
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              searchParamsDraft.locationSource === "custom"
                ? `Custom Location: (${searchParamsDraft.locationName})`
                : searchParamsDraft.locationName ?? "Search for a location"
            }
          />
        </div>

        <div className="px-1 text-xs font-medium text-default-text/70">
          {locationQuery.isError
            ? "Error loading location"
            : locationInvalid && "Cannot find location"}
        </div>
      </div>

      <MapProvider
        locationCustomizeable
        isLoading={locationQuery.isLoading}
        searchParams={searchParams}
        setSearchParams={updateSearchParamsDraft}
        className="w-full h-[200px] lg:h-[300px] grow"
      />

      <Link
        to="."
        onClick={() =>
          document.getElementById(RESULTS_PANE_ID)?.scrollIntoView()
        }
        disabled={!searchParams}
        search={{ search: searchParams }}
      >
        <Button variant="primary">Search</Button>
      </Link>

      {children}
    </Card>
  );
};

export default LocationSearchCard;
