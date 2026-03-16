import { getRouteApi, useNavigate } from "@tanstack/react-router";
import classNames from "classnames";
import GardenPlantNotes from "components/garden/GardenPlantNotes";
import PlantAnimation from "components/PlantAnimation";
import ActivePlantPane from "components/plantResults/ActivePlantPane";
import PlantList from "components/plantResults/PlantList";
import PlantFilterForm from "components/plantSearch/plantFilters/PlantFilterForm";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import Button from "designSystem/Button";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_GARDEN, GET_GARDEN_PLANTS } from "graphqlHelpers/gardenQueries";
import useGardenActionList from "hooks/plantActionLists/useGardenActionList";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { useApolloQuery } from "hooks/useQuery";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";

const route = getRouteApi("/_private/gardens/$gardenName");

const Garden = () => {
  const navigate = useNavigate();
  const { gardenName } = route.useParams();
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    plantFilter,
  } = route.useSearch();

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const { data: { userGarden } = {}, ...gardenQuery } = useApolloQuery(
    GET_GARDEN,
    { variables: { gardenName } },
  );

  const gardenPlantsQuery = useApolloQuery(GET_GARDEN_PLANTS, {
    variables: {
      gardenId: userGarden?._id,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: plantFilter,
    },
    skip: !userGarden?._id,
    fetchPolicy: "cache-and-network",
  });

  const gardenPlants = gardenPlantsQuery.data?.userGardenPlants;
  const displayCount =
    gardenPlants?.count ??
    gardenPlantsQuery.previousData?.userGardenPlants?.count ??
    0;
  const hasNoResults = gardenPlants && !gardenPlants.count;

  const gardenActionList = useGardenActionList({
    gardenId: userGarden?._id,
    refetchGarden: gardenPlantsQuery.refetch,
  });

  return (
    <main
      className={classNames("page-buffer page-container", {
        "h-dvh-header": hasNoResults,
      })}
    >
      <PageTitle className="flex gap-4 items-center">
        <Button
          variant="icon-white"
          onClick={() =>
            navigate({
              to: "/user-gardens",
            })
          }
          className="!-my-8 small-screen:w-8"
          icon={<MdArrowBack className="small-screen:w-8" />}
        />
        {gardenName}
      </PageTitle>

      <LoadingOverlay
        debounceShow
        transparent
        show={gardenPlantsQuery.loading || gardenQuery.loading}
        className="absolute top-0 left-0"
      />

      <PlantSelectionProvider
        plantList={gardenPlants?.results ?? []}
        plantListLoading={gardenPlantsQuery.loading}
        totalItems={displayCount}
        plantActions={gardenActionList}
        {...{ page, pageSize }}
      >
        <FloatingHeader>
          <PlantFilterForm
            renderMode="popover"
            onOpenPopover={() => setShowFiltersModal(true)}
            onClose={() => setShowFiltersModal(false)}
            popoverIsOpen={showFiltersModal}
          />

          <ItemCountWithLoader
            className="col-start-2"
            label="Plant"
            count={displayCount}
          />

          <PaginationControl
            className="ml-auto"
            totalItems={displayCount}
            replaceUrl
            {...{ page, pageSize }}
          />
        </FloatingHeader>

        {hasNoResults && (
          <PlantAnimation isInitialSearch={!plantFilter} className="my-auto" />
        )}

        <PlantList showFadeInAnimation className="pb-10" />
        <ActivePlantPane>
          {userGarden && (
            <GardenPlantNotes
              gardenId={userGarden._id}
              refetchPlants={gardenPlantsQuery.refetch}
            />
          )}
        </ActivePlantPane>
      </PlantSelectionProvider>
    </main>
  );
};

export default Garden;
