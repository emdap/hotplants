import { FilterInputComponentProps } from "./filterUtil";

export type TextFilterInputProps = FilterInputComponentProps<"text", string>;

const TextFilterInput = ({
  filterInput: { inputType, dataKey },
  value,
  onChange,
}: TextFilterInputProps) => (
  <input
    id={dataKey}
    type={inputType}
    value={value ? String(value) : ""}
    placeholder={`Enter ${inputType}`}
    onChange={({ target }) => onChange(target.value || undefined)}
    className="styled-input"
  />
);

export default TextFilterInput;
