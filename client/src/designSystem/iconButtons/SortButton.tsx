import classNames from "classnames";
import Button, { ButtonProps } from "designSystem/Button";
import { MdSort } from "react-icons/md";

const SortButton = ({
  sortApplied,
  className,
  ...buttonProps
}: { sortApplied: boolean } & Omit<ButtonProps, "icon">) => (
  <Button
    variant="icon-white"
    className={classNames(sortApplied && "", className)}
    {...buttonProps}
    icon={<MdSort />}
  />
);

export default SortButton;
