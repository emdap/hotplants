import classNames from "classnames";
import MapProvider from "components/interactiveMap/MapProvider";
import PlantSearchFormFooter from "components/plantDataControls/PlantDataFormFooter";
import { PlantSearchFormProps } from "components/plantDataControls/plantSearchFormUtil";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { useSearchParamsContext } from "contexts/searchParams/SearchParamsContext";
import Card from "designSystem/Card";
import InputField from "designSystem/InputField";
import { useReactQuery } from "hooks/useQuery";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import {
  customLocationDisplay,
  lookupLocationInput,
  reverseLookupLocation,
  validateNominatimLocation,
} from "util/locationUtil";
import StyledPlantForm from "../StyledPlantForm";

const PlantLocationForm = ({
  renderMode,
  hideFooter,
  onClose,
  onSubmit,
}: PlantSearchFormProps) => {
  const {
    searchParams: { location: appliedLocation },
    searchParamsDraft,

    updateSearchParamsDraft,
    applySearchParams,
  } = useSearchParamsContext();

  const { getResultsContainer } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);
  const [searchInput, setSearchInput] = useState(
    searchParamsDraft?.location?.locationName || "",
  );
  const [debouncedInput, setDebouncedInput] = useState(searchInput);
  const [locationInvalid, setLocationInvalid] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] =
    useState<GeolocationCoordinates | null>(null);

  useDebounce(() => setDebouncedInput(searchInput), 1000, [searchInput]);

  const resetFormData = () => {
    setLocationInvalid(false);
    setSearchInput("");
    setDebouncedInput("");
    setUseCurrentLocation(null);
  };

  useEffect(() => {
    appliedLocation?.locationSource === "custom" && resetFormData();
  }, [appliedLocation?.locationSource]);

  const toggleCurrentLocation = (enabled: boolean) => {
    if (enabled) {
      try {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => setUseCurrentLocation(coords),
          () => {
            toast.warning(
              "Unable to get current location. Please check your location sharing settings.",
            );
            setUseCurrentLocation(null);
          },
        );
      } catch {
        toast.warning(
          "Getting current location is not supported by this browser.",
        );
      }
    } else {
      setUseCurrentLocation(null);
    }
  };

  const reverseLookupQuery = useReactQuery({
    queryKey: ["reverse-lookup", useCurrentLocation],
    ignoreServerReady: true,
    enabled: Boolean(useCurrentLocation),
    retry: false,
    queryFn: async () => {
      setLocationInvalid(false);

      if (useCurrentLocation) {
        const validReverseLocation =
          await reverseLookupLocation(useCurrentLocation);
        if (validReverseLocation) {
          updateSearchParamsDraft({ location: validReverseLocation });
          setSearchInput(validReverseLocation.locationName);
          setDebouncedInput(validReverseLocation.locationName);
          return validReverseLocation;
        } else {
          setUseCurrentLocation(null);
        }
      }

      return null;
    },
  });

  const locationQuery = useReactQuery({
    queryKey: ["location-search", debouncedInput],
    ignoreServerReady: true,
    enabled: Boolean(
      !useCurrentLocation &&
      debouncedInput &&
      searchParamsDraft?.location?.locationName !== debouncedInput,
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
        locationQuery.isLoading ||
        reverseLookupQuery.isLoading,
    );
  }, [
    searchInput,
    debouncedInput,
    locationQuery.isLoading,
    reverseLookupQuery.isLoading,
    setLocationPending,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !(e.target instanceof HTMLInputElement)) {
      return;
    }
    setDebouncedInput(e.target.value);
  };

  const submitSearchLocation = () => {
    if (onSubmit) {
      onSubmit();
      return;
    }

    applySearchParams({ location: searchParamsDraft?.location });
    getResultsContainer()?.scrollIntoView();

    renderMode === "modal" && onClose();
  };

  const draftIsApplied = isEqual(searchParamsDraft?.location, appliedLocation);

  const plantLocationFooter = hideFooter ? null : (
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
      {renderMode === "card" && <h2 className="text-center">Location</h2>}

      <div className="space-y-4">
        <div className="space-y-2">
          <InputField
            id="search-location"
            label="Location name"
            value={searchInput}
            className="flex-grow min-w-20"
            onBlur={() => setDebouncedInput(searchInput)}
            onKeyDown={handleKeyDown}
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              searchParamsDraft?.location?.locationSource === "custom"
                ? customLocationDisplay(searchParamsDraft.location)
                : "Enter Location"
            }
            isError={locationQuery.isError || locationInvalid}
            errorText={
              locationQuery.isError
                ? "Error loading location"
                : locationInvalid
                  ? "Cannot find location"
                  : undefined
            }
          />
          <InputField
            id="use-current-location"
            label="Use current location"
            type="checkbox"
            checked={Boolean(useCurrentLocation)}
            onChange={({ target }) => toggleCurrentLocation(target.checked)}
            className="flex-row-reverse justify-end text-sm ml-1"
          />
        </div>
      </div>
      <div className="form-item grow">
        <label>Map view</label>
        <MapProvider
          locationCustomizeable
          isLoading={locationPending}
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
