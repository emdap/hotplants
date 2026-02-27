import classNames from "classnames";
import FilterInputField from "components/plantFilters/FilterInputField";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import _ from "lodash";
import { Fragment, useEffect, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { OptionalSearchParamKey } from "util/customSchemaTypes";
import {
  DEFAULT_OPTIONAL_SEARCH_PARAMS,
  OPTIONAL_SEARCH_PARAM_FILTERS,
} from "./optionalSearchParamsUtil";

const OptionalSearchParamsInput = () => {
  const { searchParamsDraft, updateSearchParamsDraft } =
    usePlantSearchContext();
  const { scientificName, commonName } = searchParamsDraft ?? {};

  const [isExpanded, setIsExpanded] = useState(
    Boolean(searchParamsDraft?.commonName || searchParamsDraft?.scientificName),
  );
  const [optionalSearch, setOptionalSearch] = useState<{
    commonName?: string | null;
    scientificName?: string | null;
  }>({ commonName, scientificName });

  const updateOptionalSearch = (
    key: OptionalSearchParamKey,
    value?: string | null,
  ) => {
    if (value) {
      const newParams = { ...DEFAULT_OPTIONAL_SEARCH_PARAMS, [key]: value };
      setOptionalSearch(newParams);
      updateSearchParamsDraft(newParams);
    } else {
      setOptionalSearch(DEFAULT_OPTIONAL_SEARCH_PARAMS);
      updateSearchParamsDraft(DEFAULT_OPTIONAL_SEARCH_PARAMS);
    }
  };

  useEffect(() => {
    const incomingParams = { commonName, scientificName };
    if (!_.isEqual(incomingParams, optionalSearch)) {
      setOptionalSearch(incomingParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonName, scientificName]);

  return (
    <Card className="space-y-2">
      <h2
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex justify-between items-center -mr-3"
      >
        Plant name (optional)
        <Button type="button" size="small" variant="icon-white">
          <MdChevronRight
            className={classNames(
              "transition-transform",
              isExpanded ? "rotate-90" : "-rotate-90",
            )}
          />
        </Button>
      </h2>

      {isExpanded && (
        <div className="my-3">
          {OPTIONAL_SEARCH_PARAM_FILTERS.map((filter, index) => (
            <Fragment key={index}>
              <FilterInputField<"text">
                filterInput={filter}
                value={optionalSearch[filter.plantDataKey] ?? ""}
                onChange={(value) =>
                  updateOptionalSearch(filter.plantDataKey, String(value))
                }
              />
              {index === 0 && (
                <p className="text-center">
                  {"\u2013"} or {"\u2013"}
                </p>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </Card>
  );
};

export default OptionalSearchParamsInput;
