import classNames from "classnames";

type ProgressBarProps = {
  amount: number;
  total: number;
  title?: string;
  unitTitle?: string;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
};

const ProgressBar = ({
  title,
  unitTitle,
  amount,
  total,
  isLoading,
  isError,
  className,
}: ProgressBarProps) => {
  const progress = total ? Math.min(1, amount / total) : 0;

  return (
    <div className={classNames("flex flex-col gap-1", className)}>
      <p>{title}</p>

      <div
        className={classNames(
          "rounded-lg w-full h-4 overflow-hidden",

          isLoading
            ? "animate-pulse bg-secondary"
            : isError
              ? "bg-red-800"
              : "bg-secondary",
        )}
      >
        <div
          className={classNames(
            "h-full",
            progress === 1 ? "bg-green-500" : "bg-accent",
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {!isLoading && (
        <p className="text-xs text-center">
          {amount} / {total} {unitTitle}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
