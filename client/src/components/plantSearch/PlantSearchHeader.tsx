import { useNavigate } from "@tanstack/react-router";
import PlantFiltersButton from "components/plantFilters/PlantFiltersButton";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import FloatingHeader from "designSystem/FloatingHeader";
import IconButton from "designSystem/iconButtons/IconButton";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { useMemo } from "react";
import { FaGlobe } from "react-icons/fa";
import { locationDisplay } from "util/locationUtil";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    searchParams,
    searchStatus,
    isInfiniteScroll,
    setIsInfiniteScroll,
    setSearchFormState,
  } = usePlantSearchContext();
  const { page, pageSize, totalItems } = usePlantSelectionContext();

  const toggleInfiniteScroll = (enable: boolean) => {
    enable && navigate({ to: ".", search: (prev) => ({ ...prev, page: 1 }) });
    setIsInfiniteScroll(enable);
  };

  const locationTitle = useMemo(
    () => (searchParams ? locationDisplay(searchParams).title : "Location"),
    [searchParams],
  );

  return (
    <FloatingHeader className="small-screen:mx-safe-2 big-screen:px-4">
      <div className="flex lg:gap-4 items-center">
        <IconButton
          icon={<FaGlobe />}
          size="small"
          active={Boolean(searchParams)}
          onClick={() => setSearchFormState({ tab: "location", isOpen: true })}
        >
          <span className="max-lg:hidden">{locationTitle}</span>
        </IconButton>
        <PlantFiltersButton
          onClick={() => setSearchFormState({ tab: "filters", isOpen: true })}
        />
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
