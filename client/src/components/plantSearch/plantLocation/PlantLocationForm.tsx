import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import PlantSearchFormFooter from "components/plantSearch/PlantSearchFormFooter";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "components/plantSearch/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import Form from "designSystem/Form";
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
    searchParams: { location: locationParams },
    searchParamsDraft,

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
    if (locationParams?.locationSource === "custom") {
      setLocationInvalid(false);
      setSearchInput("");
      setDebouncedInput("");
    }
  }, [locationParams?.locationSource]);

  useEffect(() => {
    if (locationParams?.locationSource !== "custom") {
      setSearchInput(locationParams?.locationName ?? "");
      setDebouncedInput(locationParams?.locationName ?? "");
    }
  }, [locationParams?.locationSource, locationParams?.locationName]);

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    enabled:
      debouncedInput !== null &&
      locationParams?.locationName !== null &&
      locationParams?.locationName !== debouncedInput,
    retry: false,
    queryFn: async () => {
      setLocationInvalid(false);

      if (debouncedInput) {
        const { data } = await lookupLocationInput(debouncedInput);
        const validLocation = validateNominatimLocation(data?.[0]);
        if (validLocation) {
          updateSearchParamsDraft({ location: validLocation });
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

  const searchParamsApplied = isEqual(
    searchParamsDraft?.location,
    locationParams,
  );

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
      clearButtonProps={{
        disabled: !locationParams,
        onClick: () => applySearchParams({ location: undefined }),
      }}
    />
  );

  const plantLocationFields = (
    <div
      className={classNames("flex flex-col gap-4", {
        "pt-4": renderMode === "modal",
        "pr-4 overflow-auto": renderMode === "modal",
      })}
    >
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
            searchParamsDraft?.location?.locationSource === "custom"
              ? customLocationDisplay(searchParamsDraft.location)
              : "Enter Location"
          }
        />

        <div className="px-1 text-xs font-medium text-default-text/70">
          {locationQuery.isError
            ? "Error loading location"
            : locationInvalid && "Cannot find location"}
        </div>
      </div>

      <div className="form-item">
        <label>Map view</label>
        <MapProvider
          locationCustomizeable
          isLoading={locationQuery.isLoading || locationQuery.isFetching}
          locationParams={searchParamsDraft?.location}
          setLocationParams={(location) =>
            updateSearchParamsDraft({ location })
          }
          className="w-full h-40 big-screen:h-80 grow"
        />
      </div>
    </div>
  );

  return renderMode === "card" ? (
    <Form onSubmit={submitSearchLocation}>
      <Card className="overflow-auto">{plantLocationFields}</Card>
      {plantLocationFooter}
    </Form>
  ) : (
    <Modal title={PLANT_FORM_TITLES.location} {...modalProps}>
      <Form onSubmit={submitSearchLocation}>
        {plantLocationFields}
        {plantLocationFooter}
      </Form>
    </Modal>
  );
};

export default PlantLocationForm;
