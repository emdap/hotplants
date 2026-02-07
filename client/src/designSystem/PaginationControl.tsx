import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { PaginationParams } from "util/routeParamsUtil";
import Button from "./Button";
import VerticalDivider from "./VerticalDivider";

type PaginationControlProps = {
  page: number;
  totalResults: number;
  minPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  replaceUrl?: boolean;
  className?: string;
};

export const PaginationControl = ({
  page,
  totalResults,
  minPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  replaceUrl,
  className,
}: PaginationControlProps) => {
  const navigate = useNavigate();

  const lastPage = Math.ceil(totalResults / pageSize);

  const navToPage = (params: PaginationParams) =>
    navigate({ to: ".", search: params, replace: replaceUrl });

  const recalcPage = (newPageSize: number) => {
    const currentPageStart = (page - 1) * pageSize;
    const newPage = Math.max(
      minPage,
      Math.floor(currentPageStart / newPageSize),
    );
    navToPage({ page: newPage, pageSize: newPageSize });
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
          onClick={() => navToPage({ page: page - 1 })}
          icon={<MdChevronLeft />}
        />

        <PaginatorDropdown
          label="Page"
          selected={page}
          options={new Array(lastPage).fill(0).map((_, index) => index + 1)}
          onChange={(newPage) => navToPage({ page: newPage })}
        />

        <Button
          size="small"
          variant="icon-white"
          disabled={page === lastPage}
          onClick={() => navToPage({ page: page + 1 })}
          icon={<MdChevronRight />}
        />
      </div>

      <VerticalDivider className="mr-3" />

      <PaginatorDropdown
        label="Page size"
        selected={pageSize}
        options={pageSizeOptions}
        onChange={recalcPage}
      />
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
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useLayoutEffect(() => {
    if (pageSizeContainerRef.current) {
      pageSizeContainerRef.current
        .getElementsByClassName("active-page-button")?.[0]
        // @ts-expect-error TS missing property 'container'
        ?.scrollIntoView({ container: "nearest" });

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
      className="text-sm max-h-20 px-1.5 pr-1.5 py-0.5 min-w-fit overflow-auto flex flex-col items-center gap-1 stable-scrollbar"
    >
      <div
        className="bg-default-background/95 shadow-sm absolute top-0 left-0 rounded-md h-full -z-10"
        style={{ width: `calc(100% - ${scrollbarWidth}px` }}
      />

      {options.map((option) => (
        <MenuItem key={option}>
          <div
            className={classNames(
              "w-full min-w-6 px-1 rounded-md text-center cursor-pointer",
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
