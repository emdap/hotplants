import FireText from "designSystem/FireText";
import PageTitle from "designSystem/PageTitle";
import { useLottie } from "lottie-react";
import layingPlant from "placeholderImages/layingPlant.json";

const About = () => {
  const Lottie = useLottie({
    animationData: layingPlant,
    className: "w-[300px]",
  });
  Lottie.setSpeed(0.25);

  return (
    <main className="page-buffer page-container items-center">
      <PageTitle className="flex flex-col items-center max-w-fit">
        <FireText className="text-4xl sm:text-6xl big-screen:text-8xl text-black">
          Hot Plants
        </FireText>
        <div className="text-base italic text-right min-w-full">
          in your area
        </div>
        {Lottie.View}
      </PageTitle>
    </main>
  );
};

export default About;
