import classNames from "classnames";

const VerticalDivider = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "h-4 border-r dark:border-default-text/50",
      className,
    )}
  ></div>
);

export default VerticalDivider;
