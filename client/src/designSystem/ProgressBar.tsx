import classNames from "classnames";

type ProgressBarProps = {
  amount: number;
  total: number;
  title?: string;
  className?: string;
};

const ProgressBar = ({ title, amount, total, className }: ProgressBarProps) => {
  const progress = total ? Math.min(1, amount / total) : 0;

  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      <p>{title}</p>
      <div className="rounded-lg w-full bg-secondary h-4 overflow-hidden">
        <div
          className={classNames(
            "h-full",
            progress === 1 ? "bg-green-500" : "bg-primary",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="text-xs text-center">
        {amount} / {total}
      </p>
    </div>
  );
};

export default ProgressBar;
