import Button from "designSystem/Button";
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
    <Button
      variant="text"
      size="flush"
      className="opacity-80 focus:opacity-100 hover:opacity-100 outline-none transition-opacity"
      onClick={() => setIsDarkMode(!isDarkMode)}
      onMouseDown={startTimer}
      onMouseUp={stopTimer}
      icon={
        <motion.div key={isDarkMode ? "dark" : "light"} {...MOTION_FADE_SLIDE}>
          {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
        </motion.div>
      }
    />
  );
};

export default DarkModeToggle;
