import classNames from "classnames";
import { useAppContext } from "contexts/AppContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";

const AnimalImagesWarning = ({ className }: { className?: string }) => {
  const { showAnimalImagesWarning, hideAnimalImagesWarning } = useAppContext();

  return (
    showAnimalImagesWarning && (
      <Card className={classNames("space-y-4 max-w-fit", className)}>
        <h2>Warning</h2>
        <p>
          Results may include graphic pictures of dead or injured animals.{" "}
          <br />
          Close-up images of spiders and insects may also be present.
        </p>
        <div className="flex gap-4 justify-center [&_button]:basis-1/3">
          <Button
            size="small"
            variant="accent"
            onClick={() => hideAnimalImagesWarning()}
          >
            Close
          </Button>
          <Button size="small" onClick={() => hideAnimalImagesWarning(true)}>
            Don't show again
          </Button>
        </div>
      </Card>
    )
  );
};

export default AnimalImagesWarning;
