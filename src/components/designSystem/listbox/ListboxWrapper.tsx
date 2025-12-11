import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  ListboxProps,
} from "@headlessui/react";
import classNames from "classnames";
import { FunctionComponent, HTMLProps, useMemo, useRef, useState } from "react";
import { MdAdd, MdArrowDropDown, MdCheck } from "react-icons/md";
import Button from "../Button";
import SelectedOptions from "./SelectedOptions";

export type CustomSelectedOption = FunctionComponent<
  HTMLProps<HTMLDivElement> & { value: string }
>;

const ListboxWrapper = ({
  defaultOptions = [],
  value: listboxValue = [],
  onChange,
  ...listboxProps
}: {
  defaultOptions?: string[];
} & ListboxProps<"select", string[]>) => {
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [customOptionInput, setCustomOptionInput] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(
    () => defaultOptions.concat(customOptions),
    [defaultOptions, customOptions]
  );

  const saveCustomOption = () => {
    if (customOptionInput) {
      if (
        !defaultOptions.includes(customOptionInput) &&
        !customOptions.includes(customOptionInput)
      ) {
        setCustomOptions(customOptions.concat(customOptionInput));
      }

      if (!listboxValue.includes(customOptionInput)) {
        handleChange(listboxValue.concat(customOptionInput), true);
      }

      setCustomOptionInput("");
    }
  };

  const removeValue = (value: string) =>
    handleChange(listboxValue.filter((val) => val !== value) ?? []);

  const handleChange = (value: string[], skipCustomOptionCheck?: boolean) => {
    if (!skipCustomOptionCheck && customOptions.length) {
      setCustomOptions(
        value.length
          ? customOptions.filter((option) => value.includes(option))
          : []
      );
    }
    onChange && onChange(value);
  };

  return (
    <Listbox
      {...listboxProps}
      multiple
      value={listboxValue}
      onChange={handleChange}
    >
      <ListboxButton
        id={listboxProps.name}
        onMouseEnter={(e) => e.stopPropagation()}
        className="styled-input focus:ring-1 focus:border-1 flex justify-end items-center data-focus:ring-1 relative"
      >
        {({ open }) => {
          open && customInputRef.current?.focus();
          return (
            <>
              <SelectedOptions {...{ listboxValue, removeValue }} />

              <MdArrowDropDown
                className={classNames(
                  "group pointer-events-none size-4 fill-primary transition-transform",
                  open && "rotate-180"
                )}
                aria-hidden="true"
              />
            </>
          );
        }}
      </ListboxButton>

      <ListboxOptions
        anchor="bottom"
        transition
        className={classNames(
          "w-(--button-width) rounded-xl border border-none shadow-xs shadow-default-background/50 backdrop-blur-3xl dark:bg-transparent bg-default-background/60  p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
          "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-20"
        )}
      >
        <div
          className={classNames(
            "flex gap-4 items-center pl-6 pr-0.5",
            options.length && "mb-1 pb-1 border-b border-default-text/20"
          )}
        >
          <input
            name="custom-option"
            ref={customInputRef}
            className="!min-w-0 w-full !bg-transparent !border-0 !ring-offset-0 !ring-0 flex-grow rounded-xl"
            placeholder="Enter custom option"
            value={customOptionInput}
            onChange={({ target }) => setCustomOptionInput(target.value)}
            onBlur={saveCustomOption}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                saveCustomOption();
              } else if (e.key === " ") {
                e.stopPropagation();
              }
            }}
          />
          {customOptionInput && (
            <Button variant="secondary" size="small" onClick={saveCustomOption}>
              <MdAdd className="size-3" />
            </Button>
          )}
        </div>

        {options.map((value, index) => (
          <ListboxOption
            key={index}
            value={value}
            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-primary/20"
          >
            <MdCheck className="invisible size-4 fill-default-text group-data-selected:visible" />
            <div className="text-sm/6">{value}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};

export default ListboxWrapper;
