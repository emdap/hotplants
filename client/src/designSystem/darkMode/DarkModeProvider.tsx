import { ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { DarkModeContext, deviceDarkMode } from "./DarkModeContext";

const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [storedDarkMode, setStoredDarkMode, clearStoredDarkMode] =
    useLocalStorage<boolean | undefined>("DARK_MODE");

  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode ?? deviceDarkMode.matches,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    setTimeout(() => {
      document.documentElement.classList.toggle("theme-loaded", true);
    }, 500);
  }, [isDarkMode]);

  useEffect(() => {
    const syncDarkMode = (mediaQuery: MediaQueryListEvent) =>
      setIsDarkMode(mediaQuery.matches);

    if (storedDarkMode === undefined) {
      setIsDarkMode(deviceDarkMode.matches);
      deviceDarkMode.addEventListener("change", syncDarkMode);
    } else {
      setIsDarkMode(storedDarkMode);
    }

    return () => deviceDarkMode.removeEventListener("change", syncDarkMode);
  }, [storedDarkMode]);

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode: setStoredDarkMode,
        setToSystem: clearStoredDarkMode,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
