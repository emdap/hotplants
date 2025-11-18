import classNames from "classnames";
import { HTMLMotionProps, motion } from "motion/react";
import { HTMLProps } from "react";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children"> & { disableBlurEffect?: boolean };

const Card = ({ disableBlurEffect, className, ...props }: CardProps) => (
  <motion.div
    {...props}
    className={classNames(
      "card",
      !disableBlurEffect && "card-blurred-bg",
      className
    )}
  />
);

export default Card;
