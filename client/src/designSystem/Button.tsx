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

const getClasses = (props: ButtonProps) => {
  const hasChildren = Boolean(props.children);
  const isTextVariant = props.variant === "text";
  const loadingWithText = hasChildren && props.isLoading !== undefined;
  const iconWithText = Boolean(hasChildren && props.icon);

  return classNames(
    "rounded-md max-w-fit flex gap-3 items-center justify-center font-medium text-sm",
    props.className,
    {
      "bg-primary/90 dark:bg-primary/80 enabled:hover:bg-primary outline-primary text-white":
        props.variant === "primary",
      "bg-accent/90 dark:bg-accent/80 enabled:hover:bg-accent outline-accent text-white":
        props.variant === "accent",
      "bg-secondary/80 enabled:hover:bg-secondary outline-secondary ":
        props.variant === "secondary",

      "p-2": props.variant?.includes("icon"),
      "bg-primary/80 enabled:hover:bg-primary text-white":
        props.variant === "icon-primary",
      "enabled:hover:bg-white/20": props.variant === "icon-white",

      "text-primary enabled:hover:underline underline-offset-3 outline-none focus-visible:underline":
        isTextVariant,

      "cursor-pointer": !props.disabled,
      "opacity-50": props.disabled,
      "pl-10 [&_.icon-wrapper]:-ml-7": loadingWithText || iconWithText,
      "pr-10": loadingWithText,

      "focus-ring": !isTextVariant,
      "hover:shadow-sm": !isTextVariant && !props.disabled,
    },

    hasChildren && {
      "py-2 px-3": props.size === "default",
      "py-1 px-1.5 text-xs": props.size === "small",
    }
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
