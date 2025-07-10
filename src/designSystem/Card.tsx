import type { HTMLProps, ReactNode } from "react";

const Card = ({
  children,
  className,
  ...props
}: { children: ReactNode } & HTMLProps<HTMLDivElement>) => (
  <div
    className={`rounded border border-gray-200 shadow-sm dark:border-gray-400 dark:bg-gray-800 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
