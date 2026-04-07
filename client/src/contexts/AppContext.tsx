import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { VOID_FUNCTION } from "util/generalUtil";

export const AppContext = createContext({
  sidebarExpanded: false,
  setSidebarExpanded: VOID_FUNCTION as Dispatch<SetStateAction<boolean>>,

  serverReady: false as boolean | "error",
});

export const useAppContext = () => useContext(AppContext);
