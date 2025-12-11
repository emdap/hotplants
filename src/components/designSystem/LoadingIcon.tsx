import classNames from "classnames";
import { FaSpinner } from "react-icons/fa";
import { IconBaseProps } from "react-icons/lib";

const LoadingIcon = ({
  containerClassName,
  className,
  ...props
}: { containerClassName?: string } & IconBaseProps) => (
  <div className={containerClassName}>
    <FaSpinner {...props} className={classNames("animate-spin", className)} />
  </div>
);

export default LoadingIcon;
