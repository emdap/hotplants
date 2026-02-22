import classNames from "classnames";
import pluralize from "pluralize";
import { HTMLProps } from "react";
import LoadingIcon from "./LoadingIcon";

const ItemCountWithLoader = ({
  label,
  count,
  isLoading,
  className,
  ...props
}: {
  label: string;
  count?: number;
  isLoading?: boolean;
} & HTMLProps<HTMLDivElement>) => (
  <div
    className={classNames(
      "small-screen:text-default-text flex items-center gap-1",
      className,
    )}
    {...props}
  >
    {pluralize(label, count, true)}
    {isLoading && <LoadingIcon />}
  </div>
);

export default ItemCountWithLoader;
