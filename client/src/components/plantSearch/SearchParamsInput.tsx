import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { useReactQuery } from "hooks/useQuery";
import _ from "lodash";
import { FormEvent, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import {
  customLocationDisplay,
  lookupLocationInput,
  validateNominatimLocation,
} from "util/locationUtil";
import OptionalSearchParamsInput from "./OptionalSearchParamsInput";

const SearchParamsInput = () => {
  const {
    searchStatus,
    hasCurrentResults,
    searchParams,
    searchParamsDraft,
    validatedSearchParamsDraft,
    updateSearchParamsDraft,
    applySearchParams,
  } = usePlantSearchContext();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState<string | null>(null);
  const [locationInvalid, setLocationInvalid] = useState(false);

  useDebounce(
    () =>
      (debouncedInput !== null || searchInput) &&
      setDebouncedInput(searchInput),
    1000,
    [searchInput],
  );

  useEffect(() => {
    if (searchParamsDraft?.locationSource === "custom") {
      setLocationInvalid(false);
    }
  }, [searchParamsDraft?.locationSource]);

  useEffect(() => {
    setSearchInput(searchParams?.locationName ?? "");
    setDebouncedInput(searchParams?.locationName ?? "");
  }, [searchParams?.locationName]);

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    enabled:
      debouncedInput !== null &&
      searchParams?.locationName !== null &&
      searchParams?.locationName !== debouncedInput,
    retry: false,
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

      return null;
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  const disableSubmit =
    !searchParamsDraft ||
    _.isEqual(searchParamsDraft, searchParams) ||
    searchInput !== debouncedInput ||
    locationQuery.isLoading;

  const submitLocation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disableSubmit) {
      applySearchParams();
    }
  };

  return (
    <form
      onSubmit={submitLocation}
      className="h-full flex flex-col gap-4 overflow-auto pb-4 [&_.card]:pt-4"
    >
      <Card className="flex flex-col gap-2">
        <div className="form-item">
          <label htmlFor="search-location" className="max-w-fit pb-2">
            <h2>Location</h2>
          </label>
          <input
            id="search-location"
            value={searchInput}
            className={classNames(
              "styled-input flex-grow min-w-20",
              (locationQuery.isError || locationInvalid) &&
                "dark:!border-red-700 ring-offset-red-500/70 !border-red-500",
            )}
            onBlur={() => setDebouncedInput(searchInput)}
            onKeyDown={handleKeyDown}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              searchParamsDraft?.locationSource === "custom"
                ? customLocationDisplay(searchParamsDraft)
                : "Enter Location"
            }
          />
        </div>

        <div className="px-1 text-xs font-medium text-default-text/70">
          {locationQuery.isError
            ? "Error loading location"
            : locationInvalid && "Cannot find location"}
        </div>

        <MapProvider
          locationCustomizeable
          isLoading={locationQuery.isLoading || locationQuery.isFetching}
          searchParams={validatedSearchParamsDraft}
          setSearchParams={updateSearchParamsDraft}
          className="w-full h-[200px] lg:h-[300px] grow"
        />
      </Card>

      <OptionalSearchParamsInput />

      {(hasCurrentResults || searchParamsDraft) && (
        <Button
          className="small-screen:mt-auto!"
          disabled={disableSubmit}
          isLoading={searchStatus !== "READY"}
          type="submit"
          variant="primary"
        >
          <span className="z-1">Search</span>
        </Button>
      )}
    </form>
  );
};

export default SearchParamsInput;
