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
      "cursor-pointer rounded-sm max-w-fit hover:shadow-sm",
      className,
      {
        "bg-primary/80 hover:bg-primary": variant === "primary",
        "bg-secondary/80 hover:bg-secondary": variant === "secondary",
        "hover:bg-secondary/10": !variant,
      }
    )}
    {...buttonProps}
  />
);

export default Button;
