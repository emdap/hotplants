import { MOTION_FADE_SLIDE } from "components/designSystem/motionTransitions";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useLocalStorage } from "react-use";

const DarkModeToggle = () => {
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage<
    boolean | undefined
  >("DARK_MODE");
  const deviceDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
  const [isDarkMode, setIsDarkMode] = useState(
    storedDarkMode ?? deviceDarkMode.matches
  );

  useEffect(() => {
    const syncDarkMode = (mediaQuery: MediaQueryListEvent) =>
      setIsDarkMode(mediaQuery.matches);

    if (storedDarkMode === undefined) {
      deviceDarkMode.addEventListener("change", syncDarkMode);
    } else {
      setIsDarkMode(storedDarkMode);
    }

    return () => deviceDarkMode.removeEventListener("change", syncDarkMode);
  }, [storedDarkMode, deviceDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className="cursor-pointer text-white/80 hover:text-white"
      onClick={() => setStoredDarkMode(!isDarkMode)}
    >
      <motion.div key={isDarkMode ? "dark" : "light"} {...MOTION_FADE_SLIDE}>
        {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
