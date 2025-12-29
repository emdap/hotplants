import classNames from "classnames";
import { FaSpinner } from "react-icons/fa";
import { IconBaseProps } from "react-icons/lib";

const LoadingIcon = ({
  className,
  ...props
}: { containerClassName?: string } & IconBaseProps) => (
  <FaSpinner {...props} className={classNames("animate-spin", className)} />
);

export default LoadingIcon;
