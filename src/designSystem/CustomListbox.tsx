import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  ListboxProps,
} from "@headlessui/react";
import classNames from "classnames";
import {
  FunctionComponent,
  HTMLProps,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { MdArrowDropDown, MdCheck, MdClose } from "react-icons/md";

export type CustomSelectedOption = FunctionComponent<
  HTMLProps<HTMLDivElement> & { value: string }
>;

const CustomListbox = ({
  defaultOptions = [],
  value: listboxValue = [],
  onChange,
  ...listboxProps
}: {
  defaultOptions?: string[];
} & ListboxProps<"select", string[]>) => {
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [customOptionInput, setCustomOptionInput] = useState("");

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
    <div className="w-full max-w-md px-4">
      <Listbox
        {...listboxProps}
        multiple
        value={listboxValue}
        onChange={handleChange}
      >
        <div
          className={classNames(
            "relative block w-full rounded-md bg-white/50 text-left text-sm/6 h-8",
            "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
          )}
        >
          <ListboxButton className="absolute w-full h-full z-0">
            <MdArrowDropDown
              className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
              aria-hidden="true"
            />
          </ListboxButton>
          <div className="flex gap-2 py-1.5 pr-8 pl-3 max-w-5/6 overflow-hidden">
            {listboxValue.slice(0, 3).map((value) => (
              <SelectedOptionDisplay key={value}>
                {value}
                <MdClose
                  className="cursor-pointer"
                  onClick={() => removeValue(value)}
                />
              </SelectedOptionDisplay>
            ))}
            {listboxValue.length > 3 && (
              <SelectedOptionDisplay>
                +{listboxValue.length - 3} more
              </SelectedOptionDisplay>
            )}
          </div>
        </div>
        <ListboxOptions
          anchor="bottom"
          transition
          className={classNames(
            "w-(--button-width) rounded-xl border border-default-background/5 bg-default-background/90 p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0"
          )}
        >
          <input
            className="w-full text-sm px-2"
            placeholder="Enter custom option"
            value={customOptionInput}
            onChange={({ target }) => setCustomOptionInput(target.value)}
            onBlur={saveCustomOption}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                saveCustomOption();
              }
            }}
          />
          {options.map((value, index) => (
            <ListboxOption
              key={index}
              value={value}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <MdCheck className="invisible size-4 fill-default-text group-data-selected:visible" />
              <div className="text-sm/6">{value}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

const SelectedOptionDisplay = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-primary/40 text-xs px-1 py-0.5 w-fit flex gap-1 items-center z-10 overflow-ellipsis">
    {children}
  </div>
);

export default CustomListbox;
