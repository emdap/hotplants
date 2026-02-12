import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import _ from "lodash";
import { FormEvent, useState } from "react";
import LocationParamsInput from "./LocationParamsInput";
import OptionalSearchParamsInput from "./OptionalSearchParamsInput";

const SearchParamsInput = () => {
  const {
    searchStatus,
    hasCurrentResults,
    searchParams,
    searchParamsDraft,
    applySearchParams,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);

  const disableSubmit =
    locationPending ||
    !searchParamsDraft ||
    _.isEqual(searchParamsDraft, searchParams);

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
      <LocationParamsInput setLocationPending={setLocationPending} />
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
