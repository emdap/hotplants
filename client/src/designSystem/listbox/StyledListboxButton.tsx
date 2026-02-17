import { ListboxButton, ListboxButtonProps } from "@headlessui/react";
import classNames from "classnames";
import { MdArrowDropDown } from "react-icons/md";

const StyledListboxButton = ({
  className,
  children,
  ...props
}: ListboxButtonProps) => (
  <ListboxButton
    {...props}
    className={classNames(
      "styled-input focus:ring-1 focus:border-1 flex justify-between items-center data-focus:ring-1 relative",
      className,
    )}
  >
    {(data) => (
      <>
        {typeof children === "function" ? children(data) : children}
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

export default StyledListboxButton;
