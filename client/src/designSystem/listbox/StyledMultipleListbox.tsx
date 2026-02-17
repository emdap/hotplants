import { Listbox, ListboxProps } from "@headlessui/react";
import { FunctionComponent, HTMLProps, useMemo, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import Button from "../Button";
import SelectedOptions from "./SelectedOptions";
import StyledListboxButton from "./StyledListboxButton";
import StyledListboxOptions from "./StyledListboxOptions";

export type CustomSelectedOption = FunctionComponent<
  HTMLProps<HTMLDivElement> & { value: string }
>;

const StyledMultipleListbox = ({
  defaultOptions = [],
  value: listboxValue = [],
  allowCustomOption,
  className,
  onChange,
  ...listboxProps
}: {
  defaultOptions?: string[];
  allowCustomOption?: boolean;
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
      <StyledListboxButton
        id={listboxProps.name}
        onMouseEnter={(e) => e.stopPropagation()}
        className={className}
      >
        {({ open }) => {
          open && customInputRef.current?.focus({ preventScroll: true });
          return <SelectedOptions {...{ listboxValue, removeValue }} />;
        }}
      </StyledListboxButton>

      <StyledListboxOptions
        options={options}
        customOptionInput={
          allowCustomOption && (
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
          )
        }
      />
    </Listbox>
  );
};

export default StyledMultipleListbox;
