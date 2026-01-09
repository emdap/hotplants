import classNames from "classnames";
import Button, { ButtonProps } from "designSystem/Button";

export type OpenSidebarButtonProps = { openSidebar: () => void } & Omit<
  ButtonProps,
  "onClick" | "variant"
>;

const OpenSidebarButton = ({
  openSidebar,
  className,
  ...buttonProps
}: OpenSidebarButtonProps) => (
  <Button
    variant="text"
    onClick={openSidebar}
    className={classNames("p-0!", className)}
    {...buttonProps}
  />
);

export default OpenSidebarButton;
