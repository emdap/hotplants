import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import {
  MEDIUM_SCREEN_SIZE,
  useGetScrollContainer,
} from "hooks/useGetScrollContainer";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { HEADER_HEIGHT } from "util/generalUtil";

const ScrapeStatusBar = ({ children }: { children?: ReactNode }) => {
  const { searchStatus, totalResultsCount } = usePlantSearchContext();
  const { plantList } = usePlantSelectionContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollContainer } = useGetScrollContainer();

  const isSmallScreen = window.innerWidth < MEDIUM_SCREEN_SIZE;
  const [solidCard, setSolidCard] = useState(isSmallScreen);

  useLayoutEffect(() => {
    const setTransparency = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      setSolidCard(!rect || rect.top === HEADER_HEIGHT);
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
      solid={solidCard}
      className={classNames(
        "z-20 w-full h-20 sticky flex items-center gap-4 transition-all",
        totalResultsCount ? "opacity-100" : "opacity-0 max-md:hidden"
      )}
      style={{ top: HEADER_HEIGHT }}
    >
      <span>{searchStatus !== "READY" && <LoadingIcon />}</span>
      {totalResultsCount && (
        <span>
          Viewing {plantList.length} results out of {totalResultsCount}
        </span>
      )}

      <div className="ml-auto">{children}</div>
    </Card>
  );
};

export default ScrapeStatusBar;
