import classNames from "classnames";
import {
  createComplexFilterValue,
  FilterInputComponentProps,
  SelectInputType,
} from "components/dataControls/filterUtil";
import { ListboxValueType } from "designSystem/listbox/listboxUtil";
import StyledListbox from "designSystem/listbox/StyledListbox";
import { PlantSizeRangeInput } from "generated/graphql/graphql";
import { useState } from "react";
import { FilterValue } from "util/graphqlTypes";

export type SelectFilterInputProps = FilterInputComponentProps<
  SelectInputType,
  Exclude<FilterValue, PlantSizeRangeInput>
>;

const SelectFilterInput = ({
  filterInput: {
    dataKey,
    inputType,
    label,
    options,
    matchAllCheckbox,
    asFieldset,
    multiselect,
  },
  value: filterValue,
  className,
  onChange,
}: SelectFilterInputProps) => {
  const isComplexFilter = matchAllCheckbox !== undefined;
  const complexFilterValue = createComplexFilterValue(filterValue);

  const [matchAll, setMatchAll] = useState(complexFilterValue?.matchAll);

  const handleOnValueChange = (
    newValue: ListboxValueType | ListboxValueType[],
  ) => {
    if (
      matchAll === undefined &&
      (Array.isArray(newValue) ? !newValue.length : newValue === null)
    ) {
      onChange(undefined);
    } else if (
      isComplexFilter &&
      (!filterValue || typeof filterValue === "object") &&
      Array.isArray(newValue)
    ) {
      onChange({
        ...(typeof filterValue === "object" && filterValue),
        value: newValue,
        matchAll,
      });
    } else {
      onChange(newValue);
    }
  };

  const handleOnMatchAllChange = (newValue: boolean) => {
    setMatchAll(newValue);
    if (typeof filterValue === "object") {
      onChange({
        ...filterValue,
        matchAll: newValue || undefined,
      });
    }
  };

  const checkboxInputId = `${dataKey}-checkbox`;

  const inputLabel = <label htmlFor={dataKey}>{label}</label>;
  const inputContent = (
    <>
      <StyledListbox
        multiple={multiselect}
        placeholder="Select"
        name={dataKey}
        value={complexFilterValue.value ?? (multiselect ? [] : null)}
        onChange={handleOnValueChange}
        defaultOptions={options}
      />

      {matchAllCheckbox && (
        <div className="form-item flex-row items-center gap-2">
          <input
            id={checkboxInputId}
            type="checkbox"
            checked={matchAll ?? false}
            placeholder={`Enter ${inputType}`}
            onChange={({ target }) => handleOnMatchAllChange(target.checked)}
            className="styled-checkbox"
          />
          <label htmlFor={checkboxInputId}>Data includes all</label>
        </div>
      )}
    </>
  );

  return asFieldset ? (
    <fieldset
      className={classNames(
        "styled-fieldset form-item min-w-[unset]",
        className,
      )}
    >
      <legend>{inputLabel}</legend>

      {inputContent}
    </fieldset>
  ) : (
    <div className={classNames("form-item", className)}>
      {inputLabel}
      {inputContent}
    </div>
  );
};

export default SelectFilterInput;
