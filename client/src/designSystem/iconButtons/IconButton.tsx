import classNames from "classnames";
import Button, { ButtonProps } from "designSystem/Button";

type IconButtonProps = { active: boolean } & ButtonProps;
export type IconButtonVariantProps = Omit<IconButtonProps, "icon">;

const IconButton = ({ active, className, ...buttonProps }: IconButtonProps) => (
  <Button
    variant="icon-white"
    className={classNames(
      active &&
        "bg-primary-dark/80 hover:bg-primary-dark! shadow-sm outline-primary-dark! text-white!",
      className,
    )}
    {...buttonProps}
  />
);

export default IconButton;
