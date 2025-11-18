import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "default";
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const getClasses = ({
  variant,
  size,
  className,
  ...buttonProps
}: ButtonProps) =>
  classNames(
    "rounded-md max-w-fit flex items-center justify-center font-medium text-sm",
    className,
    {
      "bg-primary/80 enabled:hover:bg-primary focus-visible:outline-primary text-white":
        variant === "primary",
      "bg-secondary/50 enabled:hover:bg-secondary/80  focus-visible:outline-secondary ":
        variant === "secondary",

      "text-primary-dark enabled:hover:underline underline-offset-3 focus-visible:outline-0 focus-visible:underline":
        variant === "text",

      "cursor-pointer": !buttonProps.disabled,
      "opacity-50 hover:shadow-none!": buttonProps.disabled,
    },
    variant !== "text" && [
      "hover:shadow-sm button-focus-ring",
      {
        "py-2 px-3": size === "default",
        "py-1 px-1.5 text-xs": size === "small",
      },
    ]
  );

const Button = ({
  variant = "primary",
  size = "default",
  linkAddress,
  className,
  ...buttonProps
}: ButtonProps) => {
  const classes = getClasses({
    variant,
    size,
    linkAddress,
    className,
    ...buttonProps,
  });

  return linkAddress && !buttonProps.disabled ? (
    <a className={classNames("block w-fit", classes)} href={linkAddress}>
      <button {...buttonProps} />
    </a>
  ) : (
    <button className={classes} {...buttonProps} />
  );
};

export default Button;
