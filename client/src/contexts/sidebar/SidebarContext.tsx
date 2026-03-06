import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export const SidebarContext = createContext({
  sidebarExpanded: false,
  setSidebarExpanded: VOID_FUNCTION as Dispatch<SetStateAction<boolean>>,
});

export const useSidebarContext = () => useContext(SidebarContext);
