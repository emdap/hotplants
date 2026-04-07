import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingIcon from "./LoadingIcon";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "danger"
  | "text"
  | "text-primary"
  | "icon-primary"
  | "icon-white";

const BUTTON_SIZES = {
  default: "py-2 px-3 gap-3",
  small: "py-1 px-1.5 text-sm gap-2",
  flush: "p-0 gap-2",
  icon: {
    default: "p-2 gap-3",
    small: "max-lg:p-1 p-1 text-sm gap-2",
    flush: "p-0 gap-2",
  },
};

export type ButtonProps = {
  variant?: ButtonVariant;
  icon?: ReactNode;
  size?: Exclude<keyof typeof BUTTON_SIZES, "icon">;
  isLoading?: boolean;
  disableOnLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const getClasses = (props: ButtonProps) => {
  const hasChildren = Boolean(props.children);
  const loadingWithText = hasChildren && props.isLoading !== undefined;

  const isTextVariant = props.variant?.includes("text");
  const isIconVariant = props.variant?.includes("icon");

  const buttonSizeKey = props.size ?? "default";
  const buttonSize = isIconVariant
    ? BUTTON_SIZES.icon[buttonSizeKey]
    : BUTTON_SIZES[buttonSizeKey];

  return classNames(
    "styled-button",
    props.className,
    {
      "button-primary": props.variant === "primary",
      "button-accent": props.variant === "accent",
      "button-secondary": props.variant === "secondary",
      "button-danger": props.variant === "danger",

      "button-icon-primary": props.variant === "icon-primary",
      "button-icon-white": props.variant === "icon-white",

      "button-text": isTextVariant,
      "text-primary": props.variant === "text-primary",
      "enabled:hover:underline underline-offset-3 focus-visible:underline":
        isTextVariant && hasChildren,

      "opacity-50": props.isLoading && props.disableOnLoading,
      "[&_.icon-wrapper]:-ml-7 px-10": loadingWithText,

      "py-0.5 px-2": isIconVariant && buttonSizeKey === "small" && hasChildren,
    },

    buttonSize,
  );
};

const Button = ({
  variant = "primary",
  size = "default",
  isLoading,
  className,
  children,
  icon,
  disabled,
  disableOnLoading = true,
  ...directButtonProps
}: ButtonProps) => {
  const isDisabled = (disableOnLoading && isLoading) || disabled;

  return (
    <button
      disabled={isDisabled}
      className={getClasses({
        variant,
        size,
        className,
        isLoading,
        disabled: isDisabled,
        disableOnLoading,
        children,
        ...directButtonProps,
      })}
      {...directButtonProps}
    >
      {(isLoading || icon) && (
        <div className="icon-wrapper">
          {isLoading ? <LoadingIcon size={16} /> : icon}
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
