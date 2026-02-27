import { ListboxButton, ListboxButtonProps } from "@headlessui/react";
import classNames from "classnames";
import { useMemo } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { ComplexListboxOption, ListboxValueType } from "./listboxUtil";

const StyledListboxButton = ({
  className,
  children,

  placeholder,
  value,
  options,
  ...props
}: Omit<ListboxButtonProps, "value"> & {
  placeholder?: string;
  value?: ListboxValueType | ListboxValueType[];
  options?: ListboxValueType[] | ComplexListboxOption[];
}) => {
  const selectedOption = useMemo(() => {
    const selectedOption = options?.find((opt) =>
      typeof opt === "object" ? opt?.value === value : opt === value,
    );

    return typeof selectedOption === "object"
      ? selectedOption?.label
      : selectedOption === undefined
        ? selectedOption
        : String(selectedOption);
  }, [options, value]);

  const shouldShowPlaceholder = useMemo(() => {
    if (
      placeholder &&
      (value === undefined || (Array.isArray(value) && !value.length))
    ) {
      return true;
    }

    return false;
  }, [placeholder, value]);

  return (
    <ListboxButton
      {...props}
      className={classNames(
        "styled-input focus:ring-1 focus:border-1 flex justify-between items-center data-focus:ring-1 relative",
        className,
      )}
    >
      {(data) => (
        <>
          {shouldShowPlaceholder && (
            <span className="text-placeholder">{placeholder}</span>
          )}

          {children
            ? typeof children === "function"
              ? children(data)
              : children
            : value && Array.isArray(value)
              ? `${value.length} Selected`
              : selectedOption}

          <MdArrowDropDown
            className={classNames(
              "group pointer-events-none size-4 fill-primary transition-transform",
              data.open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </>
      )}
    </ListboxButton>
  );
};

export default StyledListboxButton;
