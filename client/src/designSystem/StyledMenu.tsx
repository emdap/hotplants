import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuItemsProps,
} from "@headlessui/react";
import { Link, LinkProps } from "@tanstack/react-router";
import classNames from "classnames";
import { MouseEvent, ReactNode } from "react";
import { IconType } from "react-icons/lib";
import { ButtonVariant } from "./Button";

export type MenuItemData<T = MouseEvent, R = void> = {
  label: ReactNode;
  Icon?: IconType;
  iconNode?: ReactNode;
  linkProps?: LinkProps;
  onClick?: (data: T) => R;
};

type StyledMenuProps = {
  menuButton: ReactNode;
  items?: MenuItemData[];
  itemsAsCard?: boolean;
  disabled?: boolean;
  anchor?: MenuItemsProps["anchor"];
  buttonVariant?: ButtonVariant;
  children?: ReactNode;
  className?: {
    menuItemsList?: string;
    menuItem?: string;
  };
};

const StyledMenu = ({
  menuButton,
  items,
  itemsAsCard,
  disabled,
  anchor,
  children,
  className,
}: StyledMenuProps) => {
  return (
    <Menu>
      <MenuButton as="div" disabled={disabled}>
        {menuButton}
      </MenuButton>
      <MenuItems
        transition
        modal={false}
        anchor={anchor ?? "bottom"}
        className={classNames(
          "z-30 rounded-md mt-1 text-sm transition focus:outline-none data-closed:scale-95 data-closed:opacity-0",
          { "card card-solid p-1": itemsAsCard },
          className?.menuItemsList,
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}

        {items?.map((item, index) => {
          const styledItemProps = { className: className?.menuItem, ...item };

          return (
            <MenuItem key={index}>
              {item.linkProps ? (
                <Link {...item.linkProps}>
                  <StyledMenuItem {...styledItemProps} />
                </Link>
              ) : (
                <StyledMenuItem {...styledItemProps} />
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};

const StyledMenuItem = ({
  className,
  Icon,
  iconNode,
  ...item
}: MenuItemData & { className?: string }) => (
  <div
    onClick={item.onClick}
    className={classNames(
      "cursor-pointer flex gap-2 items-center hover:bg-primary/40 p-2 rounded-md font-medium",
      className,
    )}
  >
    {Icon && <Icon size={16} />}
    {iconNode}
    {item.label}
  </div>
);

export default StyledMenu;
