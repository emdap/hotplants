import { Listbox } from "@headlessui/react";
import Button from "designSystem/Button";
import StyledListboxButton from "designSystem/listbox/StyledListboxButton";
import StyledListboxOptions from "designSystem/listbox/StyledListboxOptions";
import { useMemo } from "react";
import { MdArrowDownward, MdArrowUpward, MdDragHandle } from "react-icons/md";
import { SearchRecordFilterInput } from "util/routeParamsUtil";
import {
  BOOLEAN_FILTER_DICT,
  BooleanFilterOption,
  getFilterParamKey,
  ORDERED_BOOLEAN_FILTER_OPTIONS,
  ParamType,
  SEARCH_RECORD_QUERY_LABELS,
  SearchRecordQueryInput,
} from "./searchRecordQueryUtil";

const SearchArchiveParamControl = <T extends SearchRecordQueryInput>({
  field,
  value,
  paramType,
  onChange,
}: {
  field: T["field"];
  value?: T["value"];
  paramType: ParamType;
  onChange: (value?: T["value"]) => void;
}) => {
  const controlId = `sort-${field}`;

  const iterateSortValue = (value?: number) => {
    const nextValue = value === 1 ? -1 : value === -1 ? undefined : 1;
    onChange(nextValue);
  };

  const getBooleanValue = (): BooleanFilterOption =>
    value ? "Yes" : value === false ? "No" : "Show all";

  const paramKey = useMemo(
    () =>
      paramType === "sort"
        ? "sort"
        : getFilterParamKey(field as SearchRecordFilterInput["field"]),
    [field, paramType],
  );

  return (
    <div className="form-item flex-row justify-between items-center">
      <label className="label" htmlFor={controlId}>
        {SEARCH_RECORD_QUERY_LABELS[field]}
      </label>
      {paramKey === "sort" ? (
        <Button
          id={controlId}
          variant={value ? "icon-primary" : "icon-white"}
          size="small"
          icon={
            value === 1 ? (
              <MdArrowUpward />
            ) : value === -1 ? (
              <MdArrowDownward />
            ) : (
              <MdDragHandle />
            )
          }
          onClick={() => iterateSortValue(value as number)}
        />
      ) : paramKey === "booleanFilter" ? (
        <Listbox
          onChange={(option: BooleanFilterOption) =>
            onChange(BOOLEAN_FILTER_DICT[option])
          }
          value={getBooleanValue()}
        >
          <StyledListboxButton
            id={field}
            className="min-w-30 text-sm bg-secondary/20"
          >
            {getBooleanValue()}
          </StyledListboxButton>
          <StyledListboxOptions options={ORDERED_BOOLEAN_FILTER_OPTIONS} />
        </Listbox>
      ) : null}
    </div>
  );
};

export default SearchArchiveParamControl;
