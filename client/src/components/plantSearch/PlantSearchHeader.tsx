import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import FloatingHeader from "designSystem/FloatingHeader";
import LoadingIcon from "designSystem/LoadingIcon";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import pluralize from "pluralize";
import { FaGlobe } from "react-icons/fa";
import { PaginationControl } from "../../designSystem/PaginationControl";

const PlantSearchHeader = () => {
  const {
    page,
    pageSize,
    searchStatus,
    totalResultsCount,
    setSidebarExpanded,
  } = usePlantSearchContext();

  return (
    <FloatingHeader className="grid-centered gap-4 items-center justify-center small-screen:mx-safe-2">
      <OpenSidebarButton
        openSidebar={() => setSidebarExpanded(true)}
        className="text-accent/80! hover:text-accent! big-screen:hidden dark:text-white/80! dark:hover:text-white! mr-auto"
        icon={<FaGlobe size={16} />}
      />

      <div className="small-screen:text-default-text flex items-center gap-1 col-start-2">
        {pluralize("Plant", totalResultsCount, true)}
        {searchStatus !== "READY" && <LoadingIcon />}
      </div>

      <PaginationControl
        className="ml-auto"
        page={page}
        totalResults={totalResultsCount}
        pageSize={pageSize}
      />
    </FloatingHeader>
  );
};

export default PlantSearchHeader;
