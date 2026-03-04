import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";
import { isSafari } from "util/generalUtil";
import Button from "../Button";

type PaginatorDropdownProps = {
  label: string;
  selected: number;
  inPopover?: boolean;
  options: number[];
  disabled?: boolean;
  onChange: (option: number) => void;
};

const PaginatorDropdown = ({
  label,
  selected,
  inPopover,
  disabled,
  ...props
}: PaginatorDropdownProps) => {
  return (
    <div className="whitespace-nowrap flex gap-1.5 items-center justify-between">
      {inPopover ? label : <span className="small-screen:hidden">{label}</span>}
      <Menu>
        <MenuButton as="div" disabled={disabled}>
          <Button variant="text" size="flush" disabled={disabled}>
            {selected}
          </Button>
        </MenuButton>
        <MenuItems
          anchor="bottom"
          modal={false}
          className="z-20 -ml-1.5 mt-2 py-1 text-sm relative translate-x-1/4 outline-none overflow-visible!"
        >
          <PaginatorDropdownItems selected={selected} {...props} />
        </MenuItems>
      </Menu>
    </div>
  );
};

const PaginatorDropdownItems = ({
  selected,
  options,
  onChange,
}: Omit<PaginatorDropdownProps, "label">) => {
  const pageSizeContainerRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    // return;

    if (pageSizeContainerRef.current) {
      const activePageButton =
        pageSizeContainerRef.current.getElementsByClassName(
          "active-page-button",
        )?.[0];

      if (isSafari && activePageButton instanceof HTMLElement) {
        pageSizeContainerRef.current.scrollTo({
          top: activePageButton.offsetTop,
        });
      } else {
        //   @ts-expect-error missing "container" property
        activePageButton?.scrollIntoView({ container: "nearest" });
      }

      setScrollbarWidth(
        Math.max(
          0,
          pageSizeContainerRef.current.offsetWidth -
            pageSizeContainerRef.current.clientWidth,
        ),
      );
    }
  }, []);

  return (
    <div
      ref={pageSizeContainerRef}
      className="text-sm max-h-20 px-1.5 py-0.5 min-w-max overflow-y-auto overflow-x-hidden flex flex-col items-center gap-1 stable-scrollbar"
    >
      <div
        className="card card-solid dark:border-accent/20 p-0 absolute top-0 left-0 h-full -z-10"
        style={{ width: isSafari ? "100%" : `calc(100% - ${scrollbarWidth}px` }}
      />

      {options.map((option) => (
        <MenuItem key={option}>
          <div
            className={classNames(
              "w-6 min-w-max px-1 rounded-md text-center cursor-pointer scroll-m-8",
              option === selected
                ? "active-page-button bg-primary text-white"
                : "data-focus:bg-primary/50",
            )}
            onClick={() => onChange(option)}
          >
            {option}
          </div>
        </MenuItem>
      ))}
    </div>
  );
};

export default PaginatorDropdown;
