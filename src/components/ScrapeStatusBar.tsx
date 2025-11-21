import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { PlantSearchQueryStatus } from "hooks/usePlantSearchQueries";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";

const ScrapeStatusBar = ({
  plantQueryStatus,
  hasResults,
  currentResultsCount,
  children,
}: {
  plantQueryStatus: PlantSearchQueryStatus;
  hasResults: boolean;
  currentResultsCount?: number;
  children?: ReactNode;
}) => {
  const { plantSearchResults } = usePlantSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [disableTransparency, setDisableTransparency] = useState(false);

  // TODO: simplify other scroll effects to just use body
  useLayoutEffect(() => {
    const setTransparency = () =>
      setDisableTransparency((prev) => {
        if (prev) {
          const rect = containerRef.current?.getBoundingClientRect();
          return Boolean(!rect || rect.top === 24);
        } else {
          return body?.scrollTop !== 0;
        }
      });

    const body = document.querySelector("body");
    body?.addEventListener("scroll", setTransparency);

    return () => body?.removeEventListener("scroll", setTransparency);
  }, []);

  return (
    <Card
      ref={containerRef}
      key="status-bar"
      disableTransparency={disableTransparency}
      className={classNames(
        "z-20 w-full h-20 sticky top-6 flex items-center gap-4 transition-all",
        hasResults ? "opacity-100" : "opacity-0"
      )}
    >
      <span>{plantQueryStatus !== "READY" && <LoadingIcon />}</span>
      {currentResultsCount && (
        <span>
          Viewing {plantSearchResults.length} results out of{" "}
          {currentResultsCount}
        </span>
      )}

      <div className="ml-auto">{children}</div>
    </Card>
  );
};

export default ScrapeStatusBar;
