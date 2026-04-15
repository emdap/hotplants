import AboutSection from "components/about/AboutSection";
import { ABOUT_SECTIONS } from "components/about/aboutSectionFixtures";
import FireText from "designSystem/FireText";
import { MOTION_FADE_IN } from "designSystem/motionTransitions";
import layingPlant from "imageAssets/layingPlant.json";
import { useLottie } from "lottie-react";
import { motion } from "motion/react";

const About = () => {
  const Lottie = useLottie({
    animationData: layingPlant,
    className: "w-[175px] sm:w-[250px] big-screen:w-[300px]",
  });
  Lottie.setSpeed(0.25);

  return (
    <main className="page-buffer page-container max-w-page">
      <motion.div
        {...MOTION_FADE_IN}
        className="flex items-end gap-4 mb-8 mt-4 max-sm:justify-center sm:ml-8"
      >
        {Lottie.View}
        <div className="mt-6 mb-1 flex flex-col items-center max-w-fit font-mono text-left">
          <FireText className="text-4xl sm:text-6xl big-screen:text-8xl dark:text-red-900! text-orange-700!">
            Hot Plants
          </FireText>
          <span className="text-base italic min-w-full text-white!">
            in your area
          </span>
        </div>
      </motion.div>
      {ABOUT_SECTIONS.map((section, index) => (
        <AboutSection key={index} {...section} />
      ))}
    </main>
  );
};

export default About;
