import { ReactNode } from "react";

const HeaderMenu = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div className="h-6 w-full bg-fixed bg-top backdrop-blur-3xl pretty-background flex items-center gap-4 p-2 sticky top-0 z-10">
      {children}
    </div>
  );
};

export default HeaderMenu;
