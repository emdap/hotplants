import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

const Button = ({
  variant,
  className,
  ...buttonProps
}: {
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={classNames(
      "hover:opacity-80 cursor-pointer rounded-sm max-w-fit",
      className,
      {
        "bg-primary": variant === "primary",
        "bg-secondary": variant === "secondary",
        "hover:bg-secondary/30 hover:shadow-sm": !variant,
      }
    )}
    {...buttonProps}
  />
);

export default Button;
