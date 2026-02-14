import classNames from "classnames";
import Button, { ButtonProps } from "designSystem/Button";

type IconButtonProps = { active: boolean } & ButtonProps;
export type IconButtonVariantProps = Omit<IconButtonProps, "icon">;

const IconButton = ({ active, className, ...buttonProps }: IconButtonProps) => (
  <Button
    variant="icon-white"
    className={classNames(
      active && "bg-accent/50 shadow-sm outline-accent!",
      className,
    )}
    {...buttonProps}
  />
);

export default IconButton;
