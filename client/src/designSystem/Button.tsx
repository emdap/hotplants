import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingIcon from "./LoadingIcon";

export type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
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
  linkAddress?: string;
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
    "rounded-md flex items-center justify-center font-medium",
    props.className,
    {
      "bg-primary enabled:hover:bg-primary-faded outline-primary/80 text-white":
        props.variant === "primary",
      "bg-accent/90 dark:bg-accent/80 enabled:hover:bg-accent outline-accent text-white":
        props.variant === "accent",
      "bg-secondary/80 enabled:hover:bg-secondary outline-secondary":
        props.variant === "secondary",

      "bg-primary enabled:hover:bg-primary-faded text-white outline-primary/50":
        props.variant === "icon-primary",
      "enabled:hover:bg-white/20 outline-primary/50":
        props.variant === "icon-white",

      "enabled:hover:underline underline-offset-3 focus-visible:underline":
        isTextVariant && hasChildren,
      "text-inherit outline-primary": props.variant === "text",
      "text-primary outline-primary": props.variant === "text-primary",

      "opacity-50":
        props.disabled || (props.isLoading && props.disableOnLoading),
      "cursor-pointer": !props.disabled,
      "[&_.icon-wrapper]:-ml-7 px-10": loadingWithText,

      "focus-ring": !isTextVariant,
      "hover:shadow-sm": !isTextVariant && !props.disabled,

      "py-0.5 px-2": isIconVariant && buttonSizeKey === "small" && hasChildren,
    },

    buttonSize,
  );
};

const Button = ({
  variant = "primary",
  size = "default",
  isLoading,
  linkAddress,
  className,
  disabled,
  disableOnLoading = true,
  ...directButtonProps
}: ButtonProps) => {
  const isDisabled = (disableOnLoading && isLoading) || disabled;
  const classes = getClasses({
    variant,
    size,
    linkAddress,
    className,
    disabled: isDisabled,
    isLoading,
    disableOnLoading,
    ...directButtonProps,
  });

  const renderButton = ({ children, icon, ...props }: Partial<ButtonProps>) => (
    <button {...props}>
      {(isLoading || icon) && (
        <div className="icon-wrapper">
          {isLoading ? <LoadingIcon size={16} /> : icon}
        </div>
      )}
      {children}
    </button>
  );

  return linkAddress && !isDisabled ? (
    <Link className="block w-fit" to={linkAddress}>
      {renderButton({ className: classes, ...directButtonProps })}
    </Link>
  ) : (
    renderButton({
      disabled: isDisabled,
      className: classes,
      ...directButtonProps,
    })
  );
};

export default Button;
