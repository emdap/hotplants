import classNames from "classnames";
import { HTMLMotionProps, motion } from "motion/react";
import { HTMLProps } from "react";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children">;

const Card = ({ className, ...props }: CardProps) => (
  <motion.div
    {...props}
    className={classNames(
      "rounded border border-gray-200 shadow-sm dark:border-gray-400 bg-white dark:bg-gray-800 p-6",
      className
    )}
  />
);

export default Card;
