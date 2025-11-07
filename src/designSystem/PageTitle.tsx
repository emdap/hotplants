import { ReactNode } from "react";

const PageTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="text-white/80 px-12 text-center font-mono">{children}</h1>
);

export default PageTitle;
