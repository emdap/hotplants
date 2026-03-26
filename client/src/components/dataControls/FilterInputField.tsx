import classNames from "classnames";
import { ChangeEvent } from "react";
import { FilterValue } from "util/customSchemaTypes";
import { FilterInputComponentProps, FilterInputType } from "./filterUtil";
import RangeFilterInput, { RangeFilterInputProps } from "./RangeFilterInput";
import SelectFilterInput, { SelectFilterInputProps } from "./SelectFilterInput";

const FilterInputField = <
  T extends FilterInputType = FilterInputType,
  V extends FilterValue = FilterValue,
>(
  props: FilterInputComponentProps<T, V>,
) => {
  const {
    filterInput: { inputType, dataKey, label },
    value,
    className,
    onChange,
  } = props;

  const handleOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!value) {
      onChange(undefined);
    } else {
      onChange(value as V);
    }
  };

  return inputType.includes("select") ? (
    <SelectFilterInput {...(props as SelectFilterInputProps)} />
  ) : inputType === "range" ? (
    <RangeFilterInput {...(props as RangeFilterInputProps)} />
  ) : (
    <div className={classNames("form-item", className)}>
      <label htmlFor={dataKey}>{label}</label>
      <input
        id={dataKey}
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
