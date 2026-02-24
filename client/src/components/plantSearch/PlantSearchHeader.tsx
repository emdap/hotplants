import { useNavigate } from "@tanstack/react-router";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import { FaGlobe } from "react-icons/fa";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    searchStatus,
    isInfiniteScroll,
    setIsInfiniteScroll,
    setSidebarExpanded,
  } = usePlantSearchContext();
  const { page, pageSize, totalItems } = usePlantSelectionContext();

  const toggleInfiniteScroll = (enable: boolean) => {
    enable && navigate({ to: ".", search: (prev) => ({ ...prev, page: 1 }) });
    setIsInfiniteScroll(enable);
  };

  return (
    <FloatingHeader className="small-screen:mx-safe-2">
      <OpenSidebarButton
        openSidebar={() => setSidebarExpanded(true)}
        className="text-accent/80! hover:text-accent! big-screen:hidden dark:text-white/80! dark:hover:text-white! mr-auto"
        icon={<FaGlobe size={16} />}
      />

      <ItemCountWithLoader
        label="Plant"
        count={totalItems}
        isLoading={searchStatus === "SCRAPING_AND_POLLING"}
      />

      <PaginationControl
        className="ml-auto"
        replaceUrl
        infiniteScroll={{
          enabled: isInfiniteScroll,
          setEnabled: toggleInfiniteScroll,
        }}
        {...{ page, pageSize, totalItems }}
      />
    </FloatingHeader>
  );
};

export default PlantSearchHeader;
