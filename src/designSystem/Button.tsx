import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";
import LoadingIcon from "./LoadingIcon";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "default";
  isLoading?: boolean;
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const getClasses = (props: ButtonProps) =>
  classNames(
    "rounded-md max-w-fit flex gap-3 items-center justify-center font-medium text-sm",
    props.className,
    {
      "bg-primary/90 dark:bg-primary/80 enabled:hover:bg-primary outline-primary text-white":
        props.variant === "primary",
      "bg-secondary/50 enabled:hover:bg-secondary/80 outline-secondary ":
        props.variant === "secondary",

      "text-primary enabled:hover:underline underline-offset-3 outline-none focus-visible:underline":
        props.variant === "text",

      "cursor-pointer": !props.disabled,
      "opacity-50 hover:shadow-none!": props.disabled,
      "px-10": props.isLoading !== undefined,
    },
    props.variant !== "text" && [
      "hover:shadow-sm focus-ring",
      {
        "py-2 px-3": props.size === "default",
        "py-1 px-1.5 text-xs": props.size === "small",
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

  const renderButton = ({ children, ...props }: Partial<ButtonProps>) => (
    <button {...props}>
      {children}
      {isLoading && <LoadingIcon size={16} containerClassName="-mr-7" />}
    </button>
  );

  return linkAddress && !isDisabled ? (
    <a className={classNames("block w-fit", classes)} href={linkAddress}>
      {renderButton(directButtonProps)}
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
