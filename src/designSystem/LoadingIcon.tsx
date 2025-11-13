import classNames from "classnames";
import { FaSpinner } from "react-icons/fa";
import { IconBaseProps } from "react-icons/lib";

const LoadingIcon = ({ className, ...props }: IconBaseProps) => (
  <FaSpinner {...props} className={classNames("animate-spin", className)} />
);

export default LoadingIcon;
