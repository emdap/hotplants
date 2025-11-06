import CustomListbox from "designSystem/CustomListbox";
import { ChangeEvent, useMemo } from "react";
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
  const inputValue = useMemo(() => {
    let typesafeValue: unknown;
    switch (filterInput.inputType) {
      case "text":
        typesafeValue = (value as string) ?? "";
        break;
      case "select":
        typesafeValue = Array.isArray(value) ? value : [];
        break;
      default:
        typesafeValue = "";
    }

    return typesafeValue as PlantDataFilter[T];
  }, [value, filterInput.inputType]);

  const staticProps = useMemo(
    () => ({
      name: filterInput.label,
      value: inputValue,
    }),
    [filterInput.label, inputValue]
  );

  const inputOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (filterInput.inputType === "number") {
      const newValue = value.length ? Number(value) : 0;
      if (["height", "width"].includes(filterKey)) {
        onChange({ amount: newValue, unit: "cm" } as PlantDataFilter[T]);
      }
    } else if (filterInput.inputType === "select") {
      //   console.log(value);
    }
  };

  return (
    <div className="flex gap-2">
      <label>{filterInput.label}</label>
      {DEFAULT_INPUT_TYPE.includes(filterInput.inputType) ? (
        <input
          {...staticProps}
          value={value as string}
          type={filterInput.inputType}
          placeholder={`Enter ${filterInput.inputType}`}
          onChange={inputOnChange}
        />
      ) : filterInput.inputType === "select" ? (
        <CustomListbox
          {...staticProps}
          value={value as string[]}
          onChange={(value) => onChange(value as PlantDataFilter[T])}
          multiple
          defaultOptions={filterInput.defaultOptions}
        />
      ) : null}
    </div>
  );
};

export default FilterInputField;
