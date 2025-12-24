import classNames from "classnames";

const VerticalDivider = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "h-4 border-r border-default-background/60",
      className
    )}
  ></div>
);

export default VerticalDivider;
