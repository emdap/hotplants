import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import {
  FilterInputComponentProps,
  PLANT_UNIT_OPTIONS,
  PLANT_UNIT_SHORT_LABELS,
  VALUE_PREFIXES,
  ValueNumberKey,
  ValuePrefix,
} from "components/dataControls/filterUtil";
import StyledListboxButton from "designSystem/listbox/StyledListboxButton";
import StyledListboxOptions from "designSystem/listbox/StyledListboxOptions";
import { PlantSizeRangeInput, PlantSizeUnit } from "generated/graphql/graphql";
import { capitalize } from "lodash";
import { useState } from "react";

export type RangeFilterInputProps = FilterInputComponentProps<
  "range",
  PlantSizeRangeInput
>;

const RangeFilterInput = ({
  filterInput,
  value,
  className,
  onChange,
}: RangeFilterInputProps) => {
  const [localUnit, setLocalUnit] = useState<PlantSizeUnit>(
    PLANT_UNIT_OPTIONS[0].value,
  );

  const handleUnitChange = (unit: PlantSizeUnit) => {
    setLocalUnit(unit);
    if (value?.minAmount || value?.maxAmount) {
      onChange({ ...value, unit });
    }
  };

  const getOppositeValuePrefix = (valuePrefix: ValuePrefix) =>
    valuePrefix === "min" ? "max" : "min";

  const handleValueChange = (stringValue: string, valuePrefix: ValuePrefix) => {
    const numberValue = Number(stringValue);
    let newValue: Omit<PlantSizeRangeInput, "unit"> | undefined;

    const valueKey: ValueNumberKey = `${valuePrefix}Amount` as const;
    const oppositePrefix = getOppositeValuePrefix(valuePrefix);
    const oppositeValueKey: ValueNumberKey = `${oppositePrefix}Amount` as const;
    const oppositeValue = value?.[oppositeValueKey] ?? null;

    if (numberValue === 0) {
      newValue = oppositeValue === null ? undefined : { [valueKey]: undefined };
    } else if (oppositeValue !== null) {
      if (valuePrefix === "max" && numberValue < oppositeValue) {
        newValue = {
          maxAmount: value?.maxAmount === undefined ? oppositeValue : undefined,
        };
      } else if (valuePrefix === "min" && numberValue > oppositeValue) {
        newValue = {
          minAmount: numberValue,
          maxAmount: numberValue,
        };
      } else {
        newValue = { [valueKey]: numberValue };
      }
    } else {
      newValue = { [valueKey]: numberValue };
    }

    onChange(newValue && { ...value, ...newValue, unit: localUnit });
  };

  const unitInputId = `${filterInput.dataKey}-unit`;

  return (
    <fieldset className={classNames("styled-fieldset", className)}>
      <legend>{filterInput.label}</legend>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
        {VALUE_PREFIXES.map((valuePrefix) => {
          const elementId = `${filterInput.dataKey}-${valuePrefix}`;
          const oppositePrefix = getOppositeValuePrefix(valuePrefix);

          return (
            <div key={valuePrefix} className="form-item min-w-20">
              <label
                className="whitespace-nowrap min-w-fit"
                htmlFor={elementId}
              >
                {capitalize(valuePrefix)} ({PLANT_UNIT_SHORT_LABELS[localUnit]})
              </label>
              <input
                id={elementId}
                value={value?.[`${valuePrefix}Amount`] || ""}
                type="number"
                className="styled-input"
                placeholder="None"
                onChange={({ target }) =>
                  handleValueChange(target.value, valuePrefix)
                }
                {...{
                  [valuePrefix]: filterInput[`${valuePrefix}Value`],
                  [oppositePrefix]: filterInput[`${oppositePrefix}Value`],
                }}
              />
            </div>
          );
        })}

        <div className="form-item">
          <label htmlFor={unitInputId}>Unit</label>
          <Listbox onChange={handleUnitChange} value={localUnit}>
            <StyledListboxButton
              id={unitInputId}
              value={localUnit}
              options={PLANT_UNIT_OPTIONS}
              className="min-w-15"
            >
              {PLANT_UNIT_SHORT_LABELS[localUnit]}
            </StyledListboxButton>
            <StyledListboxOptions
              className="min-w-40"
              options={PLANT_UNIT_OPTIONS}
            />
          </Listbox>
        </div>
      </div>
    </fieldset>
  );
};

export default RangeFilterInput;
