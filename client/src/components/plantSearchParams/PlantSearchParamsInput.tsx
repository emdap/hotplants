import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import _ from "lodash";
import { FormEvent, useState } from "react";
import LocationParamsInput from "./LocationParamsInput";
import OptionalSearchParamsInput from "./OptionalSearchParamsInput";

const SearchParamsInput = ({
  onClickSearch,
}: {
  onClickSearch?: () => void;
}) => {
  const {
    searchStatus,
    hasCurrentResults,
    searchParams,
    searchParamsDraft,
    applySearchParams,
  } = usePlantSearchContext();

  const [locationPending, setLocationPending] = useState(false);

  const paramsAreApplied = _.isEqual(searchParamsDraft, searchParams);

  const disableSubmit =
    locationPending || !searchParamsDraft || paramsAreApplied;

  const submitLocation = (e: FormEvent) => {
    e.preventDefault();
    if (!disableSubmit) {
      applySearchParams();
    }
  };

  return (
    <form
      onSubmit={submitLocation}
      className="h-full flex flex-col gap-4 overflow-auto pb-4 pr-2 stable-scrollbar"
    >
      <LocationParamsInput setLocationPending={setLocationPending} />
      <OptionalSearchParamsInput />

      {(hasCurrentResults || searchParamsDraft) && (
        <Button
          className="small-screen:mt-auto!"
          disableOnLoading={false}
          disabled={disableSubmit}
          isLoading={paramsAreApplied && searchStatus !== "READY"}
          type="submit"
          variant="primary"
          onClick={onClickSearch}
        >
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchParamsInput;
