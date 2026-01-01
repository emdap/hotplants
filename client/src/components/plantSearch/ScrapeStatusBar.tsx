import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Card from "designSystem/Card";
import LoadingIcon from "designSystem/LoadingIcon";
import { useGetScrollContainer } from "hooks/useGetScrollContainer";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { isSmallScreen } from "util/generalUtil";

const ScrapeStatusBar = ({ children }: { children?: ReactNode }) => {
  const { searchStatus, totalResultsCount } = usePlantSearchContext();
  const { plantList } = usePlantSelectionContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollContainer } = useGetScrollContainer();

  const [solidCard, setSolidCard] = useState(isSmallScreen());

  useLayoutEffect(() => {
    const setTransparency = () => {
      const rect = containerRef.current?.offsetParent?.getBoundingClientRect();

      setSolidCard(!rect || rect.top <= 0);
    };

    !isSmallScreen() &&
      scrollContainer?.addEventListener("scroll", setTransparency);

    return () =>
      scrollContainer?.removeEventListener("scroll", setTransparency);
  }, [scrollContainer]);

  return (
    <Card
      ref={containerRef}
      key="status-bar"
      solid={solidCard}
      className={classNames(
        "big-screen:z-20 w-full h-20 big-screen:sticky top-header items-center gap-4 transition-all",
        totalResultsCount ? "opacity-100" : "opacity-0 hidden big-screen:flex"
      )}
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
