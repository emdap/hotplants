import { ListboxValueType } from "designSystem/listbox/listboxUtil";
import StyledMultipleListbox from "designSystem/listbox/StyledMultipleListbox";
import { useState } from "react";
import { PlantArrayValues } from "util/customSchemaTypes";
import {
  FilterInputComponentProps,
  PlantArrayFilterInput,
  SelectInputType,
} from "./plantFilterUtil";

export type SelectFilterInputFieldProps = FilterInputComponentProps<
  SelectInputType,
  keyof PlantArrayValues
>;

const SelectFilterInputField = ({
  filterInput: { plantDataKey, inputType, label, options, matchAllCheckbox },
  value: filterValue,
  onChange,
}: SelectFilterInputFieldProps) => {
  const [matchAll, setMatchAll] = useState(filterValue?.matchAll || false);

  const handleOnValueChange = (newValue: ListboxValueType[]) => {
    if (filterValue?.matchAll === undefined && !newValue.length) {
      onChange(undefined);
    } else {
      onChange({
        ...filterValue,
        value: newValue,
        matchAll,
      } as PlantArrayFilterInput);
    }
  };

  const handleOnMatchAllChange = (newValue: boolean) => {
    setMatchAll(newValue);
    if (filterValue?.value) {
      onChange({
        ...filterValue,
        matchAll: newValue || undefined,
      });
    }
  };

  const checkboxInputId = `${plantDataKey}-checkbox`;

  return (
    <fieldset className="styled-fieldset form-item">
      <legend>
        <label htmlFor={plantDataKey}>{label}</label>
      </legend>

      <StyledMultipleListbox
        multiple
        placeholder="Select"
        name={plantDataKey}
        value={filterValue?.value ?? []}
        onChange={handleOnValueChange}
        defaultOptions={options}
      />

      {matchAllCheckbox && (
        <div className="form-item flex-row items-center gap-2">
          <input
            id={checkboxInputId}
            type="checkbox"
            checked={matchAll}
            placeholder={`Enter ${inputType}`}
            onChange={({ target }) => handleOnMatchAllChange(target.checked)}
            className="styled-checkbox"
          />
          <label htmlFor={checkboxInputId}>Data includes all</label>
        </div>
      )}
    </fieldset>
  );
};

export default SelectFilterInputField;
