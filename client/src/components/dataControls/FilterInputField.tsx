import classNames from "classnames";
import { FilterValue } from "util/graphqlTypes";
import CheckboxFilterInput, {
  CheckboxFilterInputProps,
} from "./CheckboxFilterInput";
import { FilterInputComponentProps, FilterInputType } from "./filterUtil";
import RangeFilterInput, { RangeFilterInputProps } from "./RangeFilterInput";
import SelectFilterInput, { SelectFilterInputProps } from "./SelectFilterInput";
import TextFilterInput, { TextFilterInputProps } from "./TextFilterInput";

const FilterInput = <
  T extends FilterInputType = FilterInputType,
  V extends FilterValue = FilterValue,
>(
  props: FilterInputComponentProps<T, V>,
) => {
  const { filterInput } = props;

  return filterInput.inputType.includes("select") ? (
    <SelectFilterInput {...(props as SelectFilterInputProps)} />
  ) : filterInput.inputType === "range" ? (
    <RangeFilterInput {...(props as RangeFilterInputProps)} />
  ) : (
    <div
      className={classNames(
        "form-item",
        { "flex-row items-center": filterInput.inputType === "checkbox" },
        props.className,
      )}
    >
      <label htmlFor={filterInput.dataKey}>{filterInput.label}</label>
      {filterInput.inputType === "text" ? (
        <TextFilterInput {...(props as TextFilterInputProps)} />
      ) : (
        filterInput.inputType === "checkbox" && (
          <CheckboxFilterInput {...(props as CheckboxFilterInputProps)} />
        )
      )}
    </div>
  );
};

export default FilterInput;
