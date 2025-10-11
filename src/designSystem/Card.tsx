import classNames from "classnames";
import type { HTMLProps } from "react";

const Card = ({ className, ...props }: HTMLProps<HTMLDivElement>) => (
  <div
    {...props}
    className={classNames(
      "rounded border border-gray-200 shadow-sm dark:border-gray-400 bg-white dark:bg-gray-800 p-6",
      className
    )}
  />
);

export default Card;
