import { ListboxValueType } from "designSystem/listbox/listboxUtil";
import StyledListbox from "designSystem/listbox/StyledListbox";
import { useMemo, useState } from "react";
import { PlantArrayValues } from "util/customSchemaTypes";
import {
  FilterInputComponentProps,
  PlantArrayFilterInput,
  SelectInputType,
} from "./plantFilterUtil";

export type SelectFilterInputProps = FilterInputComponentProps<
  SelectInputType,
  keyof PlantArrayValues | "isPerennial"
>;

const SelectFilterInput = ({
  filterInput: {
    plantDataKey,
    inputType,
    label,
    options,
    matchAllCheckbox,
    multiselect,
  },
  value: filterValue,
  onChange,
}: SelectFilterInputProps) => {
  const { isObjectValue, currentValue, currentMatchAll } = useMemo(() => {
    if (plantDataKey === "isPerennial") {
      return {
        isObjectValue: false,
        currentValue: filterValue as ListboxValueType,
        matchAll: undefined,
      };
    } else {
      const objectFilterValue = filterValue as
        | PlantArrayFilterInput
        | undefined;

      return {
        isObjectValue: true,
        currentValue: objectFilterValue?.value,
        currentMatchAll: objectFilterValue?.matchAll ?? undefined,
      };
    }
  }, [filterValue, plantDataKey]);

  const [matchAll, setMatchAll] = useState(currentMatchAll);

  const handleOnValueChange = (
    newValue: ListboxValueType | ListboxValueType[],
  ) => {
    if (
      matchAll === undefined &&
      (Array.isArray(newValue) ? !newValue.length : newValue === null)
    ) {
      onChange(undefined);
    } else if (isObjectValue) {
      onChange({
        ...filterValue,
        value: newValue,
        matchAll,
      });
    } else {
      onChange(newValue);
    }
  };

  const handleOnMatchAllChange = (newValue: boolean) => {
    setMatchAll(newValue);
    if (isObjectValue) {
      onChange({
        ...filterValue,
        matchAll: newValue || undefined,
      });
    }
  };

  const checkboxInputId = `${plantDataKey}-checkbox`;

  return (
    <fieldset className="styled-fieldset form-item min-w-[unset]">
      <legend>
        <label htmlFor={plantDataKey}>{label}</label>
      </legend>

      <StyledListbox
        multiple={multiselect}
        placeholder="Select"
        name={plantDataKey}
        value={currentValue ?? (multiselect ? [] : null)}
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
    </fieldset>
  );
};

export default SelectFilterInput;
