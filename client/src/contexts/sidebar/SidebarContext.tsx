import { VOID_FUNCTION } from "contexts/plantSearch/PlantSearchContext";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const SidebarContext = createContext({
  sidebarExpanded: false,
  setSidebarExpanded: VOID_FUNCTION as Dispatch<SetStateAction<boolean>>,
});

export const useSidebarContext = () => useContext(SidebarContext);
