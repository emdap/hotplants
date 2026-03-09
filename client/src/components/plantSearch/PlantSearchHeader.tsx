import { useNavigate } from "@tanstack/react-router";
import PlantLocationOpenButton from "components/plantSearch/plantLocation/PlantLocationOpenButton";
import PlantNameOpenButton from "components/plantSearch/plantName/PlantNameOpenButton";
import {
  SearchFormTab,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import PlantFilterOpenButton from "./plantFilters/PlantFilterOpenButton";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
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

  const searchTabButtonProps = (tabName: SearchFormTab) => ({
    onClick: () => setSearchFormState({ tab: tabName, isOpen: true }),
  });

  return (
    <FloatingHeader className="small-screen:mx-safe-3 big-screen:px-4 overflow-auto">
      <div className="flex lg:gap-4 items-center">
        <PlantLocationOpenButton {...searchTabButtonProps("location")} />
        <PlantNameOpenButton {...searchTabButtonProps("plant-name")} />
        <PlantFilterOpenButton {...searchTabButtonProps("filters")} />
      </div>

      <ItemCountWithLoader
        label="Plant"
        className="col-start-2 whitespace-nowrap"
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
