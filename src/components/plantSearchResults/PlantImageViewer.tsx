import classNames from "classnames";
import { PlantResult } from "graphqlQueries/plantQueries";

const PlantImageViewer = ({
  plant,
  mode,
}: {
  plant: PlantResult;
  mode: "thumbnail" | "carousel";
}) => {
  return (
    <div
      className={classNames("aspect-square flex justify-center p-0!", {
        "h-full": mode === "thumbnail",
        "w-1/2 max-h-70": mode === "carousel",
      })}
    >
      <img className="h-full" src={plant.mediaUrls[0]} />
    </div>
  );
};

export default PlantImageViewer;
