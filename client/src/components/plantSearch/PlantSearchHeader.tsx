import { useNavigate } from "@tanstack/react-router";
import { OpenEntityFormProps } from "components/entityForms/entityFormUtil";
import EntityNameOpenButton from "components/entityForms/entityName/EntityNameOpenButton";
import LocationOpenButton from "components/entityForms/location/LocationOpenButton";
import {
  SearchFormTab,
  usePlantSearchContext,
} from "contexts/plantSearch/PlantSearchContext";
import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { capitalize } from "lodash";
import EntityFilterOpenButton from "../entityForms/entityFilters/EntityFilterOpenButton";

const PlantSearchHeader = () => {
  const navigate = useNavigate();
  const {
    entityType,
    searchStatus,
    isInfiniteScroll,
    setIsInfiniteScroll,
    searchFormState,
    setSearchFormState,
  } = usePlantSearchContext();
  const { page, pageSize, totalItems } = usePlantSelectionContext();

  const toggleInfiniteScroll = (enable: boolean) => {
    enable && navigate({ to: ".", search: (prev) => ({ ...prev, page: 1 }) });
    setIsInfiniteScroll(enable);
  };

  const searchTabButtonProps = (
    tabName: SearchFormTab,
  ): OpenEntityFormProps => ({
    onClick: () => setSearchFormState({ tab: tabName, isOpen: true }),
    isOpen: searchFormState.isOpen && searchFormState.tab === tabName,
  });

  return (
    <FloatingHeader className="small-screen:mx-safe-3 big-screen:px-4 overflow-auto">
      <div className="flex lg:gap-4 items-center">
        <LocationOpenButton {...searchTabButtonProps("location")} />
        <EntityNameOpenButton {...searchTabButtonProps("plant-name")} />
        <EntityFilterOpenButton {...searchTabButtonProps("filters")} />
      </div>

      <ItemCountWithLoader
        label={capitalize(entityType)}
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
