import classNames from "classnames";
import Button, { ButtonProps } from "designSystem/Button";

export type IconButtonProps = { active: boolean } & ButtonProps;
export type IconButtonVariantProps = Omit<IconButtonProps, "icon">;

const IconButton = ({ active, className, ...buttonProps }: IconButtonProps) => (
  <Button
    variant="icon-white"
    className={classNames(
      "[&_span]:max-lg:hidden outline-offset-2",
      active &&
        "bg-primary-dark/80 enabled:hover:bg-primary-dark dark:bg-primary/80 dark:enabled:hover:bg-primary outline-primary-dark text-white",
      className,
    )}
    {...buttonProps}
  />
);

export default IconButton;
