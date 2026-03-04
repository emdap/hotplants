import { useNavigate } from "@tanstack/react-router";
import PlantFilters from "components/plantFilters/PlantFilters";
import { usePlantSearchContext } from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { FaGlobe } from "react-icons/fa";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    searchStatus,
    isInfiniteScroll,
    setIsInfiniteScroll,
    setShowSearchForm,
  } = usePlantSearchContext();
  const { page, pageSize, totalItems } = usePlantSelectionContext();

  const toggleInfiniteScroll = (enable: boolean) => {
    enable && navigate({ to: ".", search: (prev) => ({ ...prev, page: 1 }) });
    setIsInfiniteScroll(enable);
  };

  return (
    <FloatingHeader className="small-screen:mx-safe-2 big-screen:pl-1">
      <div className="flex gap-1 items-center">
        <Button
          variant="icon-white"
          onClick={() => setShowSearchForm(true)}
          className="m-0! big-screen:hidden"
          icon={<FaGlobe size={16} />}
        />

        <PlantFilters className="big-screen:hidden" asPopover />
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
