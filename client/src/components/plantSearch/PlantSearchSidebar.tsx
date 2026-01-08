import classNames from "classnames";
import PlantFilters from "components/plantFilters/PlantSearchFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import OverlayMask from "designSystem/OverlayMask";
import Sidebar, { SidebarProps } from "designSystem/sidebar/Sidebar";
import LocationSearchCard from "./LocationSearchCard";

const PlantSearchSidebar = (props: SidebarProps) => {
  const { hasCurrentResults, plantFilters, setPlantFilters } =
    usePlantSearchContext();

  return (
    <Sidebar
      {...props}
      overlay={({ isExpanded, setIsExpanded }) => (
        <OverlayMask
          show={isExpanded}
          key="mask"
          className="lg:hidden bg-accent/5! backdrop-blur-md"
          onClick={() => setIsExpanded(false)}
        />
      )}
      className={(isExpanded) =>
        classNames(
          hasCurrentResults
            ? "lg:sticky lg:top-header-2 lg:h-dvh-header-2 border-r"
            : "h-max",
          [
            "max-lg:bg-accent max-lg:w-2/3 max-lg:min-w-fit",
            "max-lg:fixed max-lg:z-50 max-lg:top-0 max-lg:left-0 max-lg:h-dvh max-lg:px-safe-4 pr-0!",
          ],
          {
            "max-lg:translate-x-0 lg:w-md": isExpanded,
            "max-lg:-translate-x-full lg:w-header lg:overflow-hidden":
              !isExpanded,
          }
        )
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "lg:h-full max-h-fit space-y-4 lg:pl-4 pr-4 transition-opacity",
            hasCurrentResults && {
              "overflow-auto lg:pb-24 opacity-100 lg:delay-150 pb-20":
                isExpanded,
              "lg:opacity-0": !isExpanded,
            }
          )}
        >
          <LocationSearchCard />

          <Card className="space-y-4 scroll-m-header">
            <PlantFilters
              plantFilters={plantFilters}
              setPlantFilters={setPlantFilters}
            />
          </Card>
        </div>
      )}
    </Sidebar>
  );
};

export default PlantSearchSidebar;
