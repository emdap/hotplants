import { ReactNode } from "react";

const HeaderMenu = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <div
      className="h-6 w-full backdrop-blur-xs bg-default-background/10 flex items-center gap-4 p-2 sticky top-0 z-10"
      style={{
        WebkitMask: `linear-gradient(
            to right,
            rgba(0, 0, 0, 1) calc(100% - 20px),
            rgba(0, 0, 0, 0) calc(100% - 10px),
            rgba(0, 0, 0, 0) 100%
          )`,
      }}
    >
      {children}
    </div>
  );
};

export default HeaderMenu;
