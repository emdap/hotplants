/* eslint-disable @eslint-react/set-state-in-effect */
import { ReactNode, useEffect, useRef, useState } from "react";
import { useLocalStorage } from "react-use";
import { DarkModeContext, deviceDarkMode } from "./DarkModeContext";

const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [storedDarkMode, setStoredDarkMode, clearStoredDarkMode] =
    useLocalStorage<boolean | undefined>("DARK_MODE");

  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode ?? deviceDarkMode.matches,
  );

  const themeLoadedTimeoutRef = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    themeLoadedTimeoutRef.current &&
      clearTimeout(themeLoadedTimeoutRef.current);
    themeLoadedTimeoutRef.current = setTimeout(() => {
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
    <DarkModeContext
      value={{
        isDarkMode,
        setIsDarkMode: setStoredDarkMode,
        setToSystem: clearStoredDarkMode,
      }}
    >
      {children}
    </DarkModeContext>
  );
};

export default DarkModeProvider;
