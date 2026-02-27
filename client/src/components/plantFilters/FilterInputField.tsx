import classNames from "classnames";
import { ChangeEvent } from "react";
import { FilterInputComponentProps, FilterInputType } from "./plantFilterUtil";
import SelectFilterInputField, {
  SelectFilterInputFieldProps,
} from "./SelectFilterInputField";

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
    } else if (inputType === "number") {
      const newValue = value.length ? Number(value) : 0;
      if (["height", "width"].includes(plantDataKey)) {
        onChange({ amount: newValue, unit: "cm" });
      } else {
        onChange(newValue);
      }
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
      {
        <input
          id={plantDataKey}
          value={value ? String(value) : ""}
          type={inputType}
          placeholder={`Enter ${inputType}`}
          onChange={handleOnChange}
          className="styled-input"
        />
      }
    </div>
  );
};

export default FilterInputField;
