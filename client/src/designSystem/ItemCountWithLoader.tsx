import classNames from "classnames";
import pluralize from "pluralize";
import { HTMLProps } from "react";
import LoadingIcon from "./LoadingIcon";

type ItemCountWithLoaderProps = {
  label: string;
  count?: number;
  replaceCountWithLoader?: boolean;
  isLoading?: boolean;
} & HTMLProps<HTMLDivElement>;

const ItemCountWithLoader = ({
  label,
  count,
  isLoading,
  replaceCountWithLoader,
  className,
  ...props
}: ItemCountWithLoaderProps) => (
  <div
    className={classNames(
      "small-screen:text-default-text flex items-center gap-1",
      className,
    )}
    {...props}
  >
    <span>
      {pluralize(label, count, !(isLoading && replaceCountWithLoader))}
    </span>

    {isLoading && (
      <LoadingIcon
        className={classNames({ "order-first": replaceCountWithLoader })}
      />
    )}
  </div>
);

export default ItemCountWithLoader;
