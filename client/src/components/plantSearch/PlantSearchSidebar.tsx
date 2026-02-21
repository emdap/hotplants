import classNames from "classnames";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import Sidebar from "designSystem/sidebar/Sidebar";
import SearchParamsInput from "./SearchParamsInput";

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

            "big-screen:w-md big-screen:[&_.sidebar-button]:bg-primary-dark [&_.sidebar-button:bg-accent-light":
              isExpanded,
            "big-screen:overflow-hidden": !isExpanded,
          },
        )
      }
    >
      {({ isExpanded }) => (
        <div
          className={classNames(
            "grow big-screen:w-md big-screen:h-full big-screen:overflow-auto space-y-4 big-screen:pl-4 big-screen:pr-5 big-screen:mr-4 big-screen:pt-4 transition-opacity",
            "small-screen:pr-safe-right",
            hasCurrentResults && {
              "opacity-100 big-screen:delay-150": isExpanded,
              "big-screen:opacity-0": !isExpanded,
            },
          )}
        >
          <SearchParamsInput />
        </div>
      )}
    </Sidebar>
  );
};

export default PlantSearchSidebar;
