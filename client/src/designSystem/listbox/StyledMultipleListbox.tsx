import { Listbox, ListboxButton, ListboxProps } from "@headlessui/react";
import classNames from "classnames";
import { FunctionComponent, HTMLProps, useMemo, useRef, useState } from "react";
import { MdAdd, MdArrowDropDown } from "react-icons/md";
import Button from "../Button";
import SelectedOptions from "./SelectedOptions";
import StyledListboxOptions from "./StyledListboxOptions";

export type CustomSelectedOption = FunctionComponent<
  HTMLProps<HTMLDivElement> & { value: string }
>;

const StyledMultipleListbox = ({
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
    [defaultOptions, customOptions],
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
          : [],
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
        className="listbox-button"
      >
        {({ open }) => {
          open && customInputRef.current?.focus({ preventScroll: true });
          return (
            <>
              <SelectedOptions {...{ listboxValue, removeValue }} />

              <MdArrowDropDown
                className={classNames(
                  "group pointer-events-none size-4 fill-primary transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </>
          );
        }}
      </ListboxButton>

      <StyledListboxOptions
        options={options}
        customOptionInput={
          <>
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
              <Button
                variant="icon-primary"
                size="small"
                onClick={saveCustomOption}
                icon={<MdAdd className="size-3" />}
              />
            )}
          </>
        }
      />
    </Listbox>
  );
};

export default StyledMultipleListbox;
