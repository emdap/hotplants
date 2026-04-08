import classNames from "classnames";
import {
  createComplexFilterValue,
  FilterInputComponentProps,
  SelectInputType,
} from "components/dataControls/filterUtil";
import { ListboxValueType } from "designSystem/listbox/listboxUtil";
import StyledListbox from "designSystem/listbox/StyledListbox";
import { PlantSizeRangeInput } from "generated/graphql/graphql";
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
  value,
  className,
  onChange,
}: SelectFilterInputProps) => {
  const hasMatchAllOption = matchAllCheckbox !== undefined;
  const filterValue = createComplexFilterValue(value);

  const handleOnValueChange = (
    newValue: ListboxValueType | ListboxValueType[],
  ) => {
    if (Array.isArray(newValue) ? !newValue.length : newValue === null) {
      onChange(undefined);
    } else if (hasMatchAllOption && Array.isArray(newValue)) {
      onChange({
        ...filterValue,
        value: newValue,
      });
    } else {
      onChange(newValue);
    }
  };

  const handleOnMatchAllChange = (newValue: boolean) =>
    Array.isArray(filterValue.value) &&
    onChange({
      value: filterValue.value,
      matchAll: newValue || undefined,
    });

  const checkboxInputId = `${dataKey}-checkbox`;

  const inputLabel = <label htmlFor={dataKey}>{label}</label>;
  const inputContent = (
    <>
      <StyledListbox
        multiple={multiselect}
        placeholder="Select"
        name={dataKey}
        value={filterValue.value ?? (multiselect ? [] : null)}
        onChange={handleOnValueChange}
        defaultOptions={options}
      />

      {hasMatchAllOption && (
        <div
          className={classNames("form-item flex-row items-center gap-2", {
            disabled: !filterValue.value,
          })}
        >
          <input
            disabled={!filterValue.value}
            id={checkboxInputId}
            type="checkbox"
            checked={filterValue.matchAll ?? false}
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
