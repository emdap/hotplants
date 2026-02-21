import { usePaginationContext } from "contexts/pagination/PaginationContext";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import FloatingHeader from "designSystem/FloatingHeader";
import LoadingIcon from "designSystem/LoadingIcon";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import pluralize from "pluralize";
import { FaGlobe } from "react-icons/fa";

const PlantSearchHeader = () => {
  const {
    searchStatus,
    totalResultsCount,
    isInfiniteScroll,
    setIsInfiniteScroll,
    setSidebarExpanded,
  } = usePlantSearchContext();

  const { page, pageSize, lastPage } = usePaginationContext();

  return (
    <FloatingHeader className="small-screen:mx-safe-2">
      <OpenSidebarButton
        openSidebar={() => setSidebarExpanded(true)}
        className="text-accent/80! hover:text-accent! big-screen:hidden dark:text-white/80! dark:hover:text-white! mr-auto"
        icon={<FaGlobe size={16} />}
      />

      <div className="small-screen:text-default-text flex items-center gap-1 col-start-2">
        {pluralize("Plant", totalResultsCount, true)}
        {searchStatus === "SCRAPING_AND_POLLING" && <LoadingIcon />}
      </div>

      <PaginationControl
        className="ml-auto"
        replaceUrl
        infiniteScroll={{
          enabled: isInfiniteScroll,
          setEnabled: setIsInfiniteScroll,
        }}
        {...{ page, pageSize, lastPage }}
      />
    </FloatingHeader>
  );
};

export default PlantSearchHeader;
