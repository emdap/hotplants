import {
  ListboxOption,
  ListboxOptions,
  ListboxOptionsProps,
} from "@headlessui/react";
import classNames from "classnames";
import { ReactNode } from "react";
import { MdCheck } from "react-icons/md";

const StyledListboxOptions = ({
  options,
  customOptionInput,
  className,
  ...props
}: {
  options: string[];
  customOptionInput?: ReactNode;
} & ListboxOptionsProps) => (
  <ListboxOptions
    anchor="bottom"
    modal={false}
    transition
    className={classNames(
      "w-(--button-width) rounded-xl border border-none shadow-xs shadow-default-background/50 backdrop-blur-3xl dark:bg-transparent bg-default-background/60  p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
      "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-20",
    )}
  >
    <div
      className={classNames(
        "flex gap-4 items-center pl-6 pr-0.5",
        options.length && "mb-1 pb-1 border-b border-default-text/20",
      )}
    >
      {customOptionInput}
      {options.map((value, index) => (
        <ListboxOption
          key={index}
          value={value}
          className={classNames(
            "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-primary/20",
            className,
          )}
          {...props}
        >
          <MdCheck className="invisible size-4 fill-default-text group-data-selected:visible" />
          <div className="text-sm/6">{value}</div>
        </ListboxOption>
      ))}
    </div>
  </ListboxOptions>
);

export default StyledListboxOptions;
