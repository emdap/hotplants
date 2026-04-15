import classNames from "classnames";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import { useState } from "react";
import { useLocalStorage } from "react-use";

const AnimalResultsWarning = ({ className }: { className?: string }) => {
  const [showWarning, setShowWarning] = useLocalStorage<boolean | undefined>(
    "ANIMAL_IMAGE_WARNING",
    true,
  );
  const [sessionShowWarning, setSessionShowWarning] = useState(showWarning);

  return (
    sessionShowWarning && (
      <Card className={classNames("space-y-4 max-w-fit", className)}>
        <h2>Warning</h2>
        <p>
          Results may include graphic pictures of dead or injured animals.{" "}
          <br />
          Close-up images of spiders and insects may also be present.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="small"
            variant="accent"
            onClick={() => setSessionShowWarning(false)}
          >
            Close for now
          </Button>
          <Button
            size="small"
            onClick={() => {
              setShowWarning(false);
              setSessionShowWarning(false);
            }}
          >
            Don't show again
          </Button>
        </div>
      </Card>
    )
  );
};

export default AnimalResultsWarning;
