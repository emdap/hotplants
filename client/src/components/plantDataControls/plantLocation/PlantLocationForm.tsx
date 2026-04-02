import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import PlantSearchFormFooter from "components/plantDataControls/PlantDataFormFooter";
import {
  PLANT_FORM_TITLES,
  PlantSearchFormProps,
} from "components/plantDataControls/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import { useReactQuery } from "hooks/useQuery";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import {
  customLocationDisplay,
  lookupLocationInput,
  validateNominatimLocation,
} from "util/locationUtil";
import StyledPlantForm from "../StyledPlantForm";

const PlantLocationForm = ({ renderMode, onClose }: PlantSearchFormProps) => {
  const {
    searchParams: { location: appliedLocation },
    searchParamsDraft,

    updateSearchParamsDraft,
    applySearchParams,
    getResultsContainer,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParamsDraft?.location?.locationName || "",
  );
  const [debouncedInput, setDebouncedInput] = useState(searchInput);
  const [locationInvalid, setLocationInvalid] = useState(false);

  useDebounce(() => setDebouncedInput(searchInput), 1000, [searchInput]);

  const resetFormData = () => {
    setLocationInvalid(false);
    setSearchInput("");
    setDebouncedInput("");
  };

  useEffect(() => {
    appliedLocation?.locationSource === "custom" && resetFormData();
  }, [appliedLocation?.locationSource]);

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    enabled: Boolean(
      debouncedInput && appliedLocation?.locationName !== debouncedInput,
    ),
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

  const submitSearchLocation = () => {
    applySearchParams({ location: searchParamsDraft?.location });
    getResultsContainer()?.scrollIntoView();

    renderMode === "modal" && onClose();
  };

  const draftIsApplied = isEqual(searchParamsDraft?.location, appliedLocation);

  const plantLocationFooter = (
    <PlantSearchFormFooter
      submitButtonProps={{
        disabled: locationPending || draftIsApplied,
        onClick: submitSearchLocation,
      }}
      clearButtonProps={{
        disabled: !searchParamsDraft?.location,
        onClick: () => {
          updateSearchParamsDraft({ location: undefined });
          resetFormData();
        },
      }}
    />
  );

  const plantLocationFields = (
    <div
      className={classNames("flex flex-col gap-4 mb-4", {
        "pt-4 pr-4 overflow-auto md:flex-row justify-between md:items-start":
          renderMode === "modal",
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

      <div className="form-item grow">
        <label>Map view</label>
        <MapProvider
          locationCustomizeable
          isLoading={locationQuery.isLoading || locationQuery.isFetching}
          locationParams={searchParamsDraft?.location}
          setLocationParams={(location) => {
            resetFormData();
            updateSearchParamsDraft({ location });
          }}
          className="h-[45vh] big-screen:h-80 grow"
        />
      </div>
    </div>
  );

  return (
    <StyledPlantForm onSubmit={submitSearchLocation}>
      {renderMode === "card" ? (
        <>
          <Card className="overflow-auto">{plantLocationFields}</Card>
          {plantLocationFooter}
        </>
      ) : (
        <>
          {plantLocationFields}
          {plantLocationFooter}
        </>
      )}
    </StyledPlantForm>
  );
};

export default PlantLocationForm;
