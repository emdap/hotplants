import { ReactNode } from "react";

const PageTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="px-4 text-center pb-2 border-b-2 border-b-white/20 dark:text-white/80">
    {children}
  </h1>
);

export default PageTitle;
