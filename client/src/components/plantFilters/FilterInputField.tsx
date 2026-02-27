import classNames from "classnames";
import { ChangeEvent } from "react";
import { FilterInputComponentProps } from "./plantFilterUtil";
import SelectFilterInputField, {
  SelectFilterInputFieldProps,
} from "./SelectFilterInputField";

const FilterInputField = (props: FilterInputComponentProps) => {
  const {
    filterInput: { inputType, plantDataKey, label },
    value,
    onChange,
  } = props;

  const handleOnChange = ({
    target: { value, checked },
  }: ChangeEvent<HTMLInputElement>) => {
    if (inputType === "number") {
      const newValue = value.length ? Number(value) : 0;
      if (["height", "width"].includes(plantDataKey)) {
        onChange({ amount: newValue, unit: "cm" });
      }
    } else if (inputType === "checkbox") {
      onChange([checked]);
    } else {
      onChange(value);
    }
  };

  return inputType.includes("select") ? (
    <SelectFilterInputField {...(props as SelectFilterInputFieldProps)} />
  ) : (
    <div
      className={classNames(
        "form-item",
        ["checkbox", "range"].includes(inputType) &&
          "flex-row items-center gap-4",
      )}
    >
      <label htmlFor={plantDataKey}>{label}</label>
      <input
        id={plantDataKey}
        value={String(value)}
        type={inputType}
        placeholder={`Enter ${inputType}`}
        onChange={handleOnChange}
        className={
          inputType === "checkbox" ? "styled-checkbox" : "styled-input"
        }
      />
    </div>
  );
};

export default FilterInputField;
