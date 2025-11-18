import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import LoadingIcon from "./LoadingIcon";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "default";
  isLoading?: boolean;
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const getClasses = ({
  variant,
  size,
  className,
  ...buttonProps
}: ButtonProps) =>
  classNames(
    "rounded-md max-w-fit flex gap-2 items-center justify-center font-medium text-sm",
    className,
    {
      "bg-primary/90 dark:bg-primary/80 enabled:hover:bg-primary outline-primary text-white":
        variant === "primary",
      "bg-secondary/50 enabled:hover:bg-secondary/80 outline-secondary ":
        variant === "secondary",

      "text-primary-dark enabled:hover:underline underline-offset-3 outline-none focus-visible:underline":
        variant === "text",

      "cursor-pointer": !buttonProps.disabled,
      "opacity-50 hover:shadow-none!": buttonProps.disabled,
    },
    variant !== "text" && [
      "hover:shadow-sm focus-ring",
      {
        "py-2 px-3": size === "default",
        "py-1 px-1.5 text-xs": size === "small",
      },
    ]
  );

const Button = ({
  variant = "primary",
  size = "default",
  isLoading,
  linkAddress,
  className,
  disabled,
  ...buttonProps
}: ButtonProps) => {
  const isDisabled = isLoading || disabled;
  const classes = getClasses({
    variant,
    size,
    linkAddress,
    className,
    disabled: isDisabled,
    ...buttonProps,
  });

  const renderButton = ({ children, ...props }: Partial<ButtonProps>) => (
    <button {...props}>
      {children}
      {isLoading && <LoadingIcon />}
    </button>
  );

  return linkAddress && !isDisabled ? (
    <a className={classNames("block w-fit", classes)} href={linkAddress}>
      {renderButton(buttonProps)}
    </a>
  ) : (
    renderButton({ disabled: isDisabled, className: classes, ...buttonProps })
  );
};

export default Button;
