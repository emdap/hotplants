import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import { BOOLEAN_OPTIONS } from "components/plantSearch/plantFilters/plantFilterUtil";
import Button from "designSystem/Button";
import StyledListbox from "designSystem/listbox/StyledListbox";
import StyledListboxButton from "designSystem/listbox/StyledListboxButton";
import StyledListboxOptions from "designSystem/listbox/StyledListboxOptions";
import { SearchRecordStringFilterField } from "generated/graphql/graphql";
import { useMemo } from "react";
import { MdArrowDownward, MdArrowUpward, MdDragHandle } from "react-icons/md";
import { SearchRecordFilterInput } from "util/routeParamsUtil";
import {
  getFilterParamKey,
  ParamType,
  SEARCH_RECORD_QUERY_LABELS,
  SearchRecordQueryInput,
  STRING_FILTER_OPTIONS_DICT,
} from "./searchRecordParamUtil";

const SearchRecordSortFilterInput = <T extends SearchRecordQueryInput>({
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
          onChange={(value) => onChange(value === null ? undefined : value)}
          value={value ?? null}
        >
          <StyledListboxButton
            value={value ?? null}
            options={BOOLEAN_OPTIONS}
            className="min-w-30 text-sm"
          />
          <StyledListboxOptions options={BOOLEAN_OPTIONS} />
        </Listbox>
      ) : (
        <StyledListbox
          multiple
          className="min-w-50 max-w-50 text-sm"
          placeholder="Select"
          defaultOptions={
            STRING_FILTER_OPTIONS_DICT[field as SearchRecordStringFilterField]
          }
          value={(value || []) as string[]}
          onChange={(v) => onChange(v as T["value"])}
        />
      )}
    </div>
  );
};

export default SearchRecordSortFilterInput;
