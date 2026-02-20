import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import Button from "designSystem/Button";
import StyledListboxButton from "designSystem/listbox/StyledListboxButton";
import StyledListboxOptions from "designSystem/listbox/StyledListboxOptions";
import StyledMultipleListbox from "designSystem/listbox/StyledMultipleListbox";
import { SearchRecordStringFilterField } from "generated/graphql/graphql";
import { useMemo } from "react";
import { MdArrowDownward, MdArrowUpward, MdDragHandle } from "react-icons/md";
import { SearchRecordFilterInput } from "util/routeParamsUtil";
import {
  BOOLEAN_FILTER_DICT,
  BooleanFilterOption,
  getFilterParamKey,
  ParamType,
  SEARCH_RECORD_ORDERED_BOOLEAN_OPTIONS,
  SEARCH_RECORD_QUERY_LABELS,
  SearchRecordQueryInput,
  STRING_FILTER_OPTIONS_DICT,
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
    <div
      className={classNames("form-item grid items-center gap-x-4", {
        "grid-cols-[1fr_200px]": paramType === "filter",
        "grid-cols-[1fr_auto]": paramType === "sort",
      })}
    >
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
            className="min-w-30 text-sm not-dark:bg-secondary/20 not-dark:focus:bg-secondary/20"
          >
            {getBooleanValue()}
          </StyledListboxButton>
          <StyledListboxOptions
            options={SEARCH_RECORD_ORDERED_BOOLEAN_OPTIONS}
          />
        </Listbox>
      ) : (
        <StyledMultipleListbox
          className="min-w-50 max-w-50 not-dark:bg-secondary/20 not-dark:focus:bg-secondary/20"
          defaultOptions={
            STRING_FILTER_OPTIONS_DICT[field as SearchRecordStringFilterField]
          }
          value={(value || []) as string[]}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default SearchArchiveParamControl;
