import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingIcon from "./LoadingIcon";

type ButtonVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "text"
  | "icon-primary"
  | "icon-white";

export type ButtonProps = {
  variant?: ButtonVariant;
  icon?: ReactNode;
  size?: "small" | "default";
  isLoading?: boolean;
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BUTTON_SIZES = {
  default: "py-2 px-3",
  small: "py-1 px-1.5 text-sm",
  icon: {
    default: "p-2",
    small: "p-1",
  },
};

const getClasses = (props: ButtonProps) => {
  const hasChildren = Boolean(props.children);
  const loadingWithText = hasChildren && props.isLoading !== undefined;
  const iconWithText = Boolean(hasChildren && props.icon);

  const isTextVariant = props.variant === "text";
  const isIconVariant = props.variant?.includes("icon");

  const buttonSizeKey = props.size ?? "default";
  const buttonSize = isIconVariant
    ? BUTTON_SIZES.icon[buttonSizeKey]
    : BUTTON_SIZES[buttonSizeKey];

  return classNames(
    "rounded-md flex gap-3 items-center justify-center font-medium",
    props.className,
    {
      "bg-primary/90 dark:bg-primary/80 enabled:hover:bg-primary outline-primary text-white":
        props.variant === "primary",
      "bg-accent/90 dark:bg-accent/80 enabled:hover:bg-accent outline-accent text-white":
        props.variant === "accent",
      "bg-secondary/80 enabled:hover:bg-secondary outline-secondary ":
        props.variant === "secondary",

      "bg-primary/80 enabled:hover:bg-primary text-white":
        props.variant === "icon-primary",
      "enabled:hover:bg-white/20 outline-primary":
        props.variant === "icon-white",

      "text-primary enabled:hover:underline underline-offset-3 outline-none focus-visible:underline":
        isTextVariant,

      "cursor-pointer": !props.disabled,
      "opacity-50": props.disabled,
      "pl-10 [&_.icon-wrapper]:-ml-7": loadingWithText || iconWithText,
      "pr-10": loadingWithText,

      "focus-ring": !isTextVariant,
      "hover:shadow-sm": !isTextVariant && !props.disabled,
    },
    loadingWithText ? "pr-10" : iconWithText && "pr-3",
    buttonSize
  );
};

const Button = ({
  variant = "primary",
  size = "default",
  isLoading,
  linkAddress,
  className,
  disabled,
  ...directButtonProps
}: ButtonProps) => {
  const isDisabled = isLoading || disabled;
  const classes = getClasses({
    variant,
    size,
    linkAddress,
    className,
    disabled: isDisabled,
    isLoading,
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
    <a className="block w-fit" href={linkAddress}>
      {renderButton({ className: classes, ...directButtonProps })}
    </a>
  ) : (
    renderButton({
      disabled: isDisabled,
      className: classes,
      ...directButtonProps,
    })
  );
};

export default Button;
