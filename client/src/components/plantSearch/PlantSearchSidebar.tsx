import classNames from "classnames";
import PlantSearchFilters from "components/plantFilters/PlantSearchFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Card from "designSystem/Card";
import Sidebar, { SidebarProps } from "designSystem/sidebar/Sidebar";
import LocationSearchCard from "./LocationSearchCard";

const PlantSearchSidebar = (props: SidebarProps) => {
  const { hasCurrentResults, plantFilters, setPlantFilters } =
    usePlantSearchContext();

  return (
    <Sidebar
      {...props}
      className={(isExpanded) =>
        classNames(
          hasCurrentResults
            ? "big-screen:sticky big-screen:top-header-2 big-screen:h-dvh-header-2 border-r"
            : "h-max",
          [
            "small-screen:bg-accent small-screen:w-2/3 small-screen:min-w-fit",
            "small-screen:left-0 small-screen:px-safe-4 pr-0!",
          ],
          {
            "big-screen:w-md": isExpanded,
            "big-screen:overflow-hidden": !isExpanded,
          }
        )
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "big-screen:h-full max-h-fit space-y-4 big-screen:pl-4 pr-4 transition-opacity",
            hasCurrentResults && {
              "overflow-auto big-screen:pb-24 opacity-100 big-screen:delay-150 pb-20":
                isExpanded,
              "big-screen:opacity-0": !isExpanded,
            }
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
      )}
    </Sidebar>
  );
};

export default PlantSearchSidebar;
