import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

const Button = ({
  variant = "primary",
  linkAddress,
  className,
  ...buttonProps
}: {
  variant?: "primary" | "secondary" | "text";
  linkAddress?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const buttonElement = (
    <button
      className={classNames(
        "rounded-md max-w-fit flex items-center justify-center font-medium text-sm",
        className,
        {
          "bg-primary/80 enabled:hover:bg-primary focus-visible:outline-primary  text-white!":
            variant === "primary",
          "bg-secondary/50 enabled:hover:bg-secondary/80  focus-visible:outline-secondary ":
            variant === "secondary",
          // "hover:bg-secondary/10": variant === "default",

          "hover:shadow-sm py-2 px-3 button-focus-ring": variant !== "text",
          "enabled:text-primary-dark! enabled:hover:underline underline-offset-3 enabled:focus-visible:outline-0 focus-visible:underline":
            variant === "text",

          "cursor-pointer": !buttonProps.disabled,
          "opacity-50 hover:shadow-none!": buttonProps.disabled,
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
