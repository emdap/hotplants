import classNames from "classnames";
import StyledMultipleListbox from "designSystem/listbox/StyledMultipleListbox";
import { PlantDataInput } from "generated/graphql/graphql";
import { ChangeEvent, useMemo } from "react";
import { FilterInput, FilterInputType, SelectInput } from "./plantFilterUtil";

const DEFAULT_INPUT_TYPE = ["text", "number", "checkbox"];

const FilterInputField = <
  K extends keyof PlantDataInput,
  T extends FilterInputType,
>({
  filterInput,
  value,
  onChange,
}: {
  filterInput: FilterInput<K, T>;
  value: PlantDataInput[K];
  onChange: (value: PlantDataInput[K]) => void;
}) => {
  const { plantDataKey, inputType } = filterInput;
  const options = "options" in filterInput ? filterInput.options : null;

  const inputOnChange = ({
    target: { value, checked },
  }: ChangeEvent<HTMLInputElement>) => {
    if (inputType === "number") {
      const newValue = value.length ? Number(value) : 0;
      if (["height", "width"].includes(plantDataKey)) {
        onChange({ amount: newValue, unit: "cm" });
      }
    } else if (inputType === "checkbox") {
      // Temp hack for filering for perennial plants, need to adjust filter to allow 'show all'
      onChange(checked || undefined);
    } else {
      onChange(value);
    }
  };

  const selectInput = useMemo(
    () =>
      inputType.includes("select")
        ? ({ plantDataKey, inputType, options } as FilterInput<K, SelectInput>)
        : null,
    [inputType, plantDataKey, options],
  );

  return (
    <div
      className={classNames(
        "form-item",
        ["checkbox", "range"].includes(filterInput.inputType) &&
          "flex-row items-center gap-4",
      )}
    >
      <label htmlFor={plantDataKey}>{filterInput.label}</label>
      {DEFAULT_INPUT_TYPE.includes(inputType) ? (
        <input
          id={plantDataKey}
          value={(value as string) ?? ""}
          type={inputType}
          placeholder={`Enter ${inputType}`}
          onChange={inputOnChange}
          className={
            inputType === "checkbox" ? "styled-checkbox" : "styled-input"
          }
        />
      ) : selectInput ? (
        <StyledMultipleListbox
          name={plantDataKey}
          value={value ?? []}
          onChange={onChange}
          multiple
          defaultOptions={selectInput.options}
        />
      ) : null}
    </div>
  );
};

export default FilterInputField;
