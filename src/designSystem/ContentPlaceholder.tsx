import { useLottie } from "lottie-react";
import movingPlant from "lottieFiles/movingPlant.json";
import stillPlant from "lottieFiles/stillPlant.json";
import { useEffect } from "react";

const ContentPlaceholder = ({
  text,
  mode,
}: {
  text?: string;
  mode: "empty" | "loading";
}) => {
  const Lottie = useLottie({
    animationData: mode === "empty" ? stillPlant : movingPlant,
    className: "flex flex-col md:-mt-40",
  });
  useEffect(() => {
    mode === "empty" && Lottie.setSpeed(0.25);
  }, [Lottie, mode]);

  return (
    <div className="flex flex-col pt-10 min-h-0 max-md:gap-10 pb-4">
      {Lottie.View}
      <h4 className="text-white text-center -mt-20">
        {text ?? (mode === "empty" ? "No content available" : "Loading ...")}
      </h4>
    </div>
  );
};

export default ContentPlaceholder;
