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
    className: "flex flex-col min-h-[200px]",
  });
  useEffect(() => {
    mode === "empty" && Lottie.setSpeed(0.25);
  }, [Lottie, mode]);

  return (
    <div className="flex flex-col h-5/7 gap-10 pb-10 my-auto">
      {Lottie.View}
      <h4 className="text-white text-center px-4">
        {text ?? (mode === "empty" ? "No content available" : "Loading ...")}
      </h4>
    </div>
  );
};

export default ContentPlaceholder;
