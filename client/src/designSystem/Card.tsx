import classNames from "classnames";
import { motion } from "motion/react";
import { CommonMotionDivProps } from "util/generalUtil";

export type CardProps = CommonMotionDivProps & {
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
