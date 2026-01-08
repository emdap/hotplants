import classNames from "classnames";
import PlantSearchFilters from "components/plantFilters/PlantSearchFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import VerticalDivider from "designSystem/VerticalDivider";
import { useState } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useSwipeable } from "react-swipeable";
import LocationSearchCard from "./LocationSearchCard";

const PlantSearchFiltersHolder = () => {
  const { hasCurrentResults, plantFilters, setPlantFilters } =
    usePlantSearchContext();

  const [isExpanded, setIsExpanded] = useState(true);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsExpanded(false),
  });

  return (
    <div
      {...swipeHandlers}
      className={classNames(
        "transition-all relative w-full",
        hasCurrentResults
          ? "lg:sticky lg:top-header-2 lg:h-dvh-header-2 lg:pr-4 lg:mr-2"
          : "h-max lg:pb-20",
        isExpanded ? "lg:w-sm" : "lg:w-0"
      )}
    >
      <div
        className={classNames(
          "lg:h-full max-h-fit space-y-4",
          hasCurrentResults && "lg:overflow-auto lg:pb-24"
        )}
      >
        <LocationSearchCard />

        <Card className="space-y-4 scroll-m-header">
          <PlantSearchFilters
            plantFilters={plantFilters}
            setPlantFilters={setPlantFilters}
          />
        </Card>
      </div>

      {hasCurrentResults && (
        <div
          className={classNames(
            "max-lg:hidden flex flex-col gap-2 h-full absolute top-0 py-2 transition-all",
            isExpanded ? "right-0" : "right-6"
          )}
        >
          <VerticalDivider className="h-4" />
          <Button
            variant="text"
            size="small"
            icon={<MdChevronLeft size={16} />}
            onClick={() => setIsExpanded(!isExpanded)}
            className={classNames(
              "text-white! p-1! !-mr-3 border hover:border-white/60 border-transparent rounded-full! transition-all",
              isExpanded ? "rotate-0" : "rotate-180"
            )}
          />
          <VerticalDivider className="grow" />
        </div>
      )}
    </div>
  );
};

export default PlantSearchFiltersHolder;
