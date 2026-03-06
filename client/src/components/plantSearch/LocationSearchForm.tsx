import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import _ from "lodash";
import { FormEvent, useState } from "react";
import OptionalPlantSearchFields from "./OptionalPlantSearchFields";
import PlantLocationField from "./PlantLocationField";

const LocationSearchForm = ({ showSeparator }: { showSeparator?: boolean }) => {
  const {
    searchStatus,
    searchParams,
    searchParamsDraft,
    applySearchParams,
    scrollToResults,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);

  const searchParamsApplied = _.isEqual(searchParamsDraft, searchParams);
  const disableSubmit =
    locationPending || !searchParamsDraft || searchParamsApplied;

  const submitLocation = (e: FormEvent) => {
    e.preventDefault();
    if (!disableSubmit) {
      applySearchParams();
    }
  };

  return (
    <form
      onSubmit={submitLocation}
      className="flex flex-col overflow-hidden gap-2"
    >
      <div
        onSubmit={submitLocation}
        className="space-y-4 pr-2 overflow-auto stable-scrollbar not-dark:scrollbar-thumb-accent"
      >
        <PlantLocationField setLocationPending={setLocationPending} />
        {showSeparator && <div className="w-full border-t border-default" />}
        <OptionalPlantSearchFields />
      </div>
      <Button
        disableOnLoading={false}
        disabled={disableSubmit}
        isLoading={searchParamsApplied && searchStatus !== "READY"}
        type="submit"
        variant="primary"
        onClick={scrollToResults}
      >
        Search
      </Button>
    </form>
  );
};

export default LocationSearchForm;
