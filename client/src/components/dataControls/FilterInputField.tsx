import classNames from "classnames";
import { FilterValue } from "util/graphqlTypes";
import CheckboxFilterInput, {
  CheckboxFilterInputProps,
} from "./CheckboxFilterInput";
import { FilterInputComponentProps, FilterInputType } from "./filterUtil";
import RangeFilterInput, { RangeFilterInputProps } from "./RangeFilterInput";
import SelectFilterInput, { SelectFilterInputProps } from "./SelectFilterInput";
import TextFilterInput, { TextFilterInputProps } from "./TextFilterInput";

// TODO: Some duplicate code with 'InputField' -- could make this component more generic instead,
// to be used outside of plant filtering, and for any inputs in app?
const FilterInput = <
  T extends FilterInputType = FilterInputType,
  V extends FilterValue = FilterValue,
>({
  highlightFilledFields,
  ...props
}: FilterInputComponentProps<T, V> & { highlightFilledFields?: boolean }) => {
  const { filterInput, value } = props;

  const shouldHighlight = () => {
    if (!highlightFilledFields) {
      return false;
    }

    if (typeof value === "object" && value && "value" in value) {
      return Boolean(value.value);
    }
    return value !== undefined;
  };

  return (
    <div
      className={classNames({
        "[&_fieldset]:border-primary [&_.styled-input]:bg-primary-bright/20!":
          shouldHighlight(),
      })}
    >
      {filterInput.inputType.includes("select") ? (
        <SelectFilterInput {...(props as SelectFilterInputProps)} />
      ) : filterInput.inputType === "range" ? (
        <RangeFilterInput {...(props as RangeFilterInputProps)} />
      ) : (
        <div
          className={classNames(
            "form-item",
            {
              "flex-row items-center": filterInput.inputType === "checkbox",
            },
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
      )}
    </div>
  );
};

export default FilterInput;
