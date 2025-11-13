import ListboxWrapper from "designSystem/listbox/ListboxWrapper";
import { ChangeEvent } from "react";
import {
  FilterInput,
  FilterInputType,
  PlantDataFilter,
} from "./filterFixtures";

const DEFAULT_INPUT_TYPE = ["text", "number", "checkbox"];

const FilterInputField = <
  T extends keyof PlantDataFilter,
  P extends FilterInputType
>({
  filterKey,
  filterInput,

  value,
  onChange,
}: {
  filterKey: T;
  filterInput: FilterInput<P>;
  value: PlantDataFilter[T];
  onChange: (value: PlantDataFilter[T]) => void;
}) => {
  const inputOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (filterInput.inputType === "number") {
      const newValue = value.length ? Number(value) : 0;
      if (["height", "width"].includes(filterKey)) {
        onChange({ amount: newValue, unit: "cm" } as PlantDataFilter[T]);
      }
    } else if (filterInput.inputType === "text") {
      onChange(value as PlantDataFilter[T]);
    }
  };

  return DEFAULT_INPUT_TYPE.includes(filterInput.inputType) ? (
    <input
      id={filterKey}
      value={(value as string) ?? ""}
      type={filterInput.inputType}
      placeholder={`Enter ${filterInput.inputType}`}
      onChange={inputOnChange}
    />
  ) : filterInput.inputType === "select" ? (
    <ListboxWrapper
      name={filterKey}
      value={(value as string[]) ?? []}
      onChange={(value) => onChange(value as PlantDataFilter[T])}
      multiple
      defaultOptions={filterInput.defaultOptions}
    />
  ) : null;
};

export default FilterInputField;
