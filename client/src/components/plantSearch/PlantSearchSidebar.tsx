import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Sidebar from "designSystem/sidebar/Sidebar";
import LocationSearchCard from "./LocationSearchCard";

const PlantSearchSidebar = () => {
  const {
    hasCurrentResults,

    sidebarExpanded,
    setSidebarExpanded,
  } = usePlantSearchContext();

  return (
    <Sidebar
      isExpanded={sidebarExpanded}
      setIsExpanded={setSidebarExpanded}
      externalCollapseButton
      className={(isExpanded) =>
        classNames(
          [
            "small-screen:bg-light-accent small-screen:w-2/3 small-screen:min-w-fit small-screen:left-0",
          ],
          {
            "big-screen:sticky big-screen:top-header-2 big-screen:h-dvh-header-2 border-r":
              hasCurrentResults,
            "h-max": !hasCurrentResults,

            "big-screen:w-md [&_.sidebar-button]:bg-light-accent": isExpanded,
            "big-screen:overflow-hidden": !isExpanded,
          }
        )
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "big-screen:h-full max-h-fit big-screen:overflow-auto space-y-4 big-screen:pl-6 big-screen:pr-2 big-screen:mr-4 big-screen:pt-4 transition-opacity",
            "small-screen:pr-safe-right",
            hasCurrentResults && {
              "big-screen:pb-24 opacity-100 big-screen:delay-150 pb-20":
                isExpanded,
              "big-screen:opacity-0": !isExpanded,
            }
          )}
        >
          <LocationSearchCard />

          {/* <Card className="space-y-4 scroll-m-header">
            <PlantSearchFilters
              plantFilters={plantFilters}
              setPlantFilters={applyPlantFilters}
            />
          </Card> */}
        </div>
      )}
    </Sidebar>
  );
};

export default PlantSearchSidebar;
