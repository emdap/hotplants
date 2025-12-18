import { MOTION_FADE_SLIDE } from "designSystem/motionTransitions";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocalStorage } from "react-use";

const LONG_PRESS_TIME = 500;

const DarkModeToggle = () => {
  const mouseDownTime = useRef<number>(0);
  const deviceDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

  const [storedDarkMode, setStoredDarkMode, clearStoredDarkMode] =
    useLocalStorage<boolean | undefined>("DARK_MODE");
  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode ?? deviceDarkMode.matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
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
  }, [storedDarkMode, deviceDarkMode]);

  const startTimer = () => (mouseDownTime.current = Date.now());

  const stopTimer = () => {
    const timeDiff = Date.now() - mouseDownTime.current;
    if (timeDiff > LONG_PRESS_TIME) {
      clearStoredDarkMode();
    } else {
      setStoredDarkMode(!isDarkMode);
    }
  };

  return (
    <div
      className="cursor-pointer text-white/80 hover:text-white"
      onMouseDown={startTimer}
      onMouseUp={stopTimer}
    >
      <motion.div key={isDarkMode ? "dark" : "light"} {...MOTION_FADE_SLIDE}>
        {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
