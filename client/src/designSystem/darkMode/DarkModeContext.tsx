import { VOID_FUNCTION } from "contexts/plantSearch/PlantSearchContext";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const deviceDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

type DarkModeContextType = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean | undefined>>;
  setToSystem: () => void;
};

export const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: deviceDarkMode.matches,
  setIsDarkMode: VOID_FUNCTION,
  setToSystem: VOID_FUNCTION,
});

export const useDarkMode = () => useContext(DarkModeContext);
