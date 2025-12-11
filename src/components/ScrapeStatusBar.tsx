import classNames from "classnames";
import Card from "components/designSystem/Card";
import LoadingIcon from "components/designSystem/LoadingIcon";
import { usePlantSearchContext } from "contexts/PlantSearchContext";
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
  const { scrollContainer } = useGetScrollContainer();

  const isSmallScreen = window.innerWidth < MEDIUM_SCREEN_SIZE;
  const [disableTransparency, setDisableTransparency] = useState(isSmallScreen);

  useLayoutEffect(() => {
    const setTransparency = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setDisableTransparency(!rect || rect.top === 24);
    };

    !isSmallScreen &&
      scrollContainer?.addEventListener("scroll", setTransparency);

    return () =>
      scrollContainer?.removeEventListener("scroll", setTransparency);
  }, [scrollContainer, isSmallScreen]);

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
