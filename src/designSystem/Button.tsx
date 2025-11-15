import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

const Button = ({
  variant = "default",
  linkAddress,
  className,
  ...buttonProps
}: {
  variant?: "primary" | "secondary" | "text" | "default";
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const buttonElement = (
    <button
      className={classNames(
        "rounded-sm max-w-fit flex items-center justify-center p-1",
        className,
        {
          "bg-primary/80 hover:bg-primary": variant === "primary",
          "bg-secondary/80 hover:bg-secondary": variant === "secondary",
          "hover:bg-secondary/10": variant === "default",
          "hover:shadow-sm": variant !== "text",

          "cursor-pointer": !buttonProps.disabled,
          "opacity-50 hover:bg-transparent! hover:shadow-none!":
            buttonProps.disabled,
        }
      )}
      {...buttonProps}
    />
  );

  return linkAddress && !buttonProps.disabled ? (
    <a className="block w-fit" href={linkAddress}>
      {buttonElement}
    </a>
  ) : (
    buttonElement
  );
};

export default Button;
