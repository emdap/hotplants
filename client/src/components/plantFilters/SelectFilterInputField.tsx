import { ListboxValueType } from "designSystem/listbox/listboxUtil";
import StyledMultipleListbox from "designSystem/listbox/StyledMultipleListbox";
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
  const handleOnValueChange = (newValue: ListboxValueType[]) => {
    if (filterValue?.matchAll === undefined && !newValue.length) {
      onChange(undefined);
    } else {
      onChange({ ...filterValue, value: newValue } as PlantArrayFilterInput);
    }
  };

  const handleOnMatchAllChange = (newValue: boolean) => {
    if (!filterValue?.value && !newValue) {
      onChange(undefined);
    } else {
      onChange({
        ...filterValue,
        matchAll: newValue || undefined,
      });
    }
  };

  return (
    <div className="form-item">
      <label htmlFor={plantDataKey}>{label}</label>

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
          <label htmlFor={plantDataKey}>Include all</label>
          <input
            id={plantDataKey}
            type="checkbox"
            checked={Boolean(filterValue?.matchAll)}
            placeholder={`Enter ${inputType}`}
            onChange={({ target }) => handleOnMatchAllChange(target.checked)}
            className="styled-checkbox"
          />
        </div>
      )}
    </div>
  );
};

export default SelectFilterInputField;
