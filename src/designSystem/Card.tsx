import classNames from "classnames";
import { HTMLMotionProps, motion } from "motion/react";
import { HTMLProps } from "react";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children"> & { disableBlurEffect?: boolean };

const Card = ({ disableBlurEffect, className, ...props }: CardProps) => (
  <motion.div
    {...props}
    className={classNames(
      "rounded border border-gray-200 shadow-md dark:border-gray-800/20 p-4 md:p-6",
      className,
      disableBlurEffect
        ? "bg-default-background dark:bg-gray-800"
        : "bg-default-background/80 dark:bg-gray-800/80 backdrop-blur-2xl"
    )}
  />
);

export default Card;
