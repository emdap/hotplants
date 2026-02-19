import { ReactNode, useState } from "react";
import { SidebarContext } from "./SidebarContext";

const SidebarContextProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarExpanded, setSidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
