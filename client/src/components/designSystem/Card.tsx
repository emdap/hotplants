import classNames from "classnames";
import { HTMLMotionProps, motion } from "motion/react";
import { HTMLProps } from "react";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children"> & {
    disableTransparency?: boolean;
  };

const Card = ({ disableTransparency, className, ...props }: CardProps) => (
  <motion.div
    {...props}
    className={classNames(
      "card",
      !disableTransparency && "card-transparent",
      className
    )}
  />
);

export default Card;
