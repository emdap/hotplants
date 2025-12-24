import classNames from "classnames";
import { HTMLMotionProps, motion } from "motion/react";
import { HTMLProps } from "react";

export type CardProps = Omit<HTMLMotionProps<"div">, "children"> &
  Pick<HTMLProps<HTMLDivElement>, "children"> & {
    solid?: boolean;
    solidOnHover?: boolean;
  };

const Card = ({ solid, solidOnHover, className, ...props }: CardProps) => (
  <motion.div
    {...props}
    className={classNames(
      "card",
      { "card-solid": solid, "hover:card-solid": solidOnHover },
      className
    )}
  />
);

export default Card;
