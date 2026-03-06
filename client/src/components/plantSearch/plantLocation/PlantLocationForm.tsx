import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import PlantSearchFormFooter from "components/plantSearch/PlantSearchFormFooter";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import Modal from "designSystem/Modal";
import { useReactQuery } from "hooks/useQuery";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import {
  customLocationDisplay,
  lookupLocationInput,
  validateNominatimLocation,
} from "util/locationUtil";

const PlantLocationForm = ({
  renderMode,
  ...modalProps
}: PlantSearchFormProps) => {
  const {
    searchParams,
    searchParamsDraft,
    validatedSearchParamsDraft,
    updateSearchParamsDraft,
    applySearchParams,
    getResultsContainer,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);
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
      setSearchInput("");
      setDebouncedInput("");
    }
  }, [searchParamsDraft?.locationSource]);

  useEffect(() => {
    if (searchParams?.locationSource !== "custom") {
      setSearchInput(searchParams?.locationName ?? "");
      setDebouncedInput(searchParams?.locationName ?? "");
    }
  }, [searchParams?.locationSource, searchParams?.locationName]);

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

  useEffect(() => {
    setLocationPending(
      (searchInput && searchInput !== debouncedInput) ||
        locationQuery.isLoading,
    );
  }, [
    searchInput,
    debouncedInput,
    locationQuery.isLoading,
    setLocationPending,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  const searchParamsApplied = isEqual(searchParamsDraft, searchParams);

  const submitSearchLocation = () => {
    applySearchParams();
    getResultsContainer()?.scrollIntoView();
  };

  const plantLocationFooter = (
    <PlantSearchFormFooter
      submitButtonProps={{
        disabled: locationPending || !searchParamsDraft || searchParamsApplied,
        onClick: submitSearchLocation,
      }}
      // clearButtonProps={{
      //   disabled: isEqual(
      //     { scientificName, commonName },
      //     DEFAULT_PLANT_NAME_FIELDS,
      //   ),
      //   onClick: clearPlantNameSearch,
      // }}
    />
  );

  const plantLocationFields = (
    <div className="space-y-3 mb-3">
      {renderMode === "card" && <h2>{PLANT_FORM_TITLES.location}</h2>}

      <div className="form-item">
        <label htmlFor="search-location" className="max-w-fit">
          Location name
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

        <div className="px-1 text-xs font-medium text-default-text/70">
          {locationQuery.isError
            ? "Error loading location"
            : locationInvalid && "Cannot find location"}
        </div>
      </div>

      <MapProvider
        locationCustomizeable
        isLoading={locationQuery.isLoading || locationQuery.isFetching}
        searchParams={validatedSearchParamsDraft}
        setSearchParams={updateSearchParamsDraft}
        className="w-full h-[200px] lg:h-[300px] grow"
      />
    </div>
  );

  return renderMode === "card" ? (
    <>
      <Card className="flex flex-col gap-2">{plantLocationFields}</Card>
      {plantLocationFooter}
    </>
  ) : (
    <Modal title={PLANT_FORM_TITLES.location} {...modalProps}>
      {plantLocationFields}
      {plantLocationFooter}
    </Modal>
  );
};

export default PlantLocationForm;
