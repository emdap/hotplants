import { ChangeEvent } from "react";
import { FilterInputComponentProps, FilterInputType } from "./plantFilterUtil";
import RangeFilterInput, { NumberFilterInputProps } from "./RangeFilterInput";
import SelectFilterInput, { SelectFilterInputProps } from "./SelectFilterInput";

const FilterInputField = <T extends FilterInputType = FilterInputType>(
  props: FilterInputComponentProps<T>,
) => {
  const {
    filterInput: { inputType, plantDataKey, label },
    value,
    onChange,
  } = props;

  const handleOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      onChange(undefined);
    } else {
      onChange(value);
    }
  };

  return inputType.includes("select") ? (
    <SelectFilterInput {...(props as SelectFilterInputProps)} />
  ) : inputType === "range" ? (
    <RangeFilterInput {...(props as NumberFilterInputProps)} />
  ) : (
    <div className="form-item">
      <label htmlFor={plantDataKey}>{label}</label>
      <input
        id={plantDataKey}
        value={value ? String(value) : ""}
        type={inputType}
        placeholder={`Enter ${inputType}`}
        onChange={handleOnChange}
        className="styled-input"
      />
    </div>
  );
};

export default FilterInputField;
