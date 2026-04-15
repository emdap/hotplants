import classNames from "classnames";

const BetaTag = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "rounded-full bg-white text-primary! text-[10px] font-bold max-w-fit max-h-fit px-1.5 scale-[0.75] opacity-80",
      className,
    )}
  >
    BETA
  </div>
);
export default BetaTag;
