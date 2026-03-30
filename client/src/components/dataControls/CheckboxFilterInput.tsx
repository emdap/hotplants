import { FilterInputComponentProps } from "./filterUtil";

export type CheckboxFilterInputProps = FilterInputComponentProps<
  "checkbox",
  boolean
>;

const CheckboxFilterInput = ({
  filterInput: { inputType, dataKey },
  value,
  onChange,
}: CheckboxFilterInputProps) => (
  <input
    id={dataKey}
    type={inputType}
    checked={value}
    onChange={({ target }) => onChange(target.checked || undefined)}
    className="styled-checkbox"
  />
);

export default CheckboxFilterInput;
