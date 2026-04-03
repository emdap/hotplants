import classNames from "classnames";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

const InputField = ({
  id,
  label,
  isError,
  errorText,
  className,
  placeholder,
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  id: string;
  label: string;
  isError?: boolean;
  errorText?: string;
}) => (
  <div
    className={classNames("form-item", {
      "flex-row items-center": props.type === "checkbox",
    })}
  >
    <label htmlFor={id} className="max-w-fit">
      {label}
    </label>
    <input
      id={id}
      className={classNames(
        props.type === "checkbox" ? "styled-checkbox" : "styled-input",
        isError &&
          "dark:!border-red-700 ring-offset-red-500/70 !border-red-500",
        className,
      )}
      placeholder={placeholder ?? "Enter"}
      {...props}
    />

    {isError && (
      <div className="px-1 text-xs font-medium text-default-text/70">
        {errorText ?? "Invalid input"}
      </div>
    )}
  </div>
);

export default InputField;
