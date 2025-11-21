import classNames from "classnames";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import {
  MEDIUM_SCREEN_SIZE,
  useGetScrollContainer,
} from "hooks/useGetScrollContainer";
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
  const { scrollContainer } = useGetScrollContainer();

  useLayoutEffect(() => {
    const setTransparency = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setDisableTransparency(!rect || rect.top === 24);
    };

    window.innerWidth >= MEDIUM_SCREEN_SIZE &&
      scrollContainer?.addEventListener("scroll", setTransparency);

    return () =>
      scrollContainer?.removeEventListener("scroll", setTransparency);
  }, [scrollContainer]);

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
