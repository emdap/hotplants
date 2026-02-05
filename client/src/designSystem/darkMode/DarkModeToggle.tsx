import { MOTION_FADE_SLIDE } from "designSystem/motionTransitions";
import { motion } from "motion/react";
import { useRef } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useDarkMode } from "./DarkModeContext";

const LONG_PRESS_TIME = 500;

const DarkModeToggle = () => {
  const { isDarkMode, setIsDarkMode, setToSystem } = useDarkMode();

  const mouseDownTime = useRef<number>(0);

  const startTimer = () => (mouseDownTime.current = Date.now());

  const stopTimer = () => {
    const timeDiff = Date.now() - mouseDownTime.current;
    if (timeDiff > LONG_PRESS_TIME) {
      setToSystem();
    } else {
      setIsDarkMode(!isDarkMode);
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
