import { useNavigate } from "@tanstack/react-router";
import PlantFilters from "components/plantFilters/PlantFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import FloatingHeader from "designSystem/FloatingHeader";
import FilterButton from "designSystem/iconButtons/FilterButton";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import OpenSidebarButton from "designSystem/sidebar/OpenSidebarButton";
import StyledPopover from "designSystem/StyledPopover";
import { FaGlobe } from "react-icons/fa";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    searchStatus,
    isInfiniteScroll,
    plantFilter,
    applyPlantFilter,
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
      <div className="flex gap-2 items-center">
        <OpenSidebarButton
          openSidebar={() => setSidebarExpanded(true)}
          className="text-accent/80! hover:text-accent! big-screen:hidden dark:text-white/80! dark:hover:text-white!"
          icon={<FaGlobe size={16} />}
        />

        <StyledPopover
          anchor="bottom start"
          button={<FilterButton active={Boolean(plantFilter)} />}
        >
          <PlantFilters {...{ plantFilter, applyPlantFilter }} />
        </StyledPopover>
      </div>

      <ItemCountWithLoader
        label="Plant"
        className="col-start-2"
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
