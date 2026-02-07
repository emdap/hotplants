import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import classNames from "classnames";
import { useLayoutEffect, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Button from "./Button";
import VerticalDivider from "./VerticalDivider";

type PaginationControlProps = {
  page: number;
  lastPage: number;
  minPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  className?: string;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
};

export const PaginationControl = ({
  page,
  lastPage,
  minPage = 1,
  className,
  onPageChange,

  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageSizeChange,
}: PaginationControlProps) => {
  const recalcPage = (newPageSize: number) => {
    const currentPageStart = (page - 1) * pageSize;
    const newPage = Math.max(
      minPage,
      Math.floor(currentPageStart / newPageSize),
    );

    onPageChange(newPage);
    onPageSizeChange && onPageSizeChange(newPageSize);
  };

  return (
    <div
      className={classNames("flex items-center gap-2 px-4 text-sm", className)}
    >
      <div className="flex gap-1 items-center">
        <Button
          size="small"
          variant="icon-white"
          disabled={page === minPage}
          onClick={() => onPageChange(page - 1)}
          icon={<MdChevronLeft />}
        />

        <PaginatorDropdown
          label="Page"
          selected={page}
          options={new Array(lastPage).fill(0).map((_, index) => index + 1)}
          onChange={onPageChange}
        />

        <Button
          size="small"
          variant="icon-white"
          disabled={page === lastPage}
          onClick={() => onPageChange(page + 1)}
          icon={<MdChevronRight />}
        />
      </div>

      {onPageSizeChange && (
        <>
          <VerticalDivider className="mr-3" />

          <PaginatorDropdown
            label="Page size"
            selected={pageSize}
            options={pageSizeOptions}
            onChange={recalcPage}
          />
        </>
      )}
    </div>
  );
};

type PaginatorDropdownProps = {
  label: string;
  selected: number;
  options: number[];
  onChange: (option: number) => void;
};

const PaginatorDropdown = ({
  label,
  selected,
  ...props
}: PaginatorDropdownProps) => (
  <div className="whitespace-nowrap flex gap-1.5 items-center">
    {label}{" "}
    <Menu>
      <MenuButton as="div">
        <Button variant="text" size="flush">
          {selected}
        </Button>
      </MenuButton>
      <MenuItems
        anchor="bottom"
        modal={false}
        className="z-20 -ml-1.5 mt-1 py-1 text-sm relative translate-x-1/4 outline-none"
      >
        <PaginatorDropdownItems selected={selected} {...props} />
      </MenuItems>
    </Menu>
  </div>
);

const PaginatorDropdownItems = ({
  selected,
  options,
  onChange,
}: Omit<PaginatorDropdownProps, "label">) => {
  const pageSizeContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    pageSizeContainerRef.current
      ?.getElementsByClassName("active-page-button")?.[0]
      // @ts-expect-error TS missing property 'container'
      ?.scrollIntoView({ container: "nearest" });
  }, []);

  return (
    <div
      ref={pageSizeContainerRef}
      className="text-sm h-20 pl-1.5 pr-4 pb-1 min-w-fit overflow-auto flex flex-col items-center gap-1 stable-scrollbar"
    >
      <div
        className="bg-default-background/95 shadow-sm absolute top-0 left-0 rounded-md h-full -z-10"
        style={{ width: "calc(100% - 0.625rem" }}
      />

      {options.map((option) => (
        <MenuItem key={option}>
          <Button
            variant="text"
            size="flush"
            className={classNames(
              "w-full min-w-max px-1",
              option === selected
                ? "active-page-button bg-primary text-white"
                : "data-focus:bg-primary/20",
            )}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        </MenuItem>
      ))}
    </div>
  );
};
