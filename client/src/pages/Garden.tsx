import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantList from "components/plantResults/PlantList";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import Button from "designSystem/Button";
import FloatingHeader from "designSystem/FloatingHeader";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import { GET_GARDEN, GET_GARDEN_PLANTS } from "graphqlHelpers/gardenQueries";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { useApolloQuery } from "hooks/useQuery";
import { MdArrowBack } from "react-icons/md";

const route = getRouteApi("/_private/gardens/$gardenName");

const Garden = () => {
  const navigate = useNavigate();
  const { gardenName } = route.useParams();
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = route.useSearch();

  const gardenQuery = useApolloQuery(GET_GARDEN, { variables: { gardenName } });

  const gardenPlantsQuery = useApolloQuery(GET_GARDEN_PLANTS, {
    variables: {
      gardenId: gardenQuery.data?.userGarden?._id,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
    skip: !gardenQuery.data?.userGarden?._id,
    fetchPolicy: "cache-and-network",
  });

  const gardenPlants =
    gardenPlantsQuery.data?.userGardenPlants ??
    gardenPlantsQuery.previousData?.userGardenPlants;
  const gardenPlantsCount = gardenPlants?.count ?? 0;

  return (
    <main className="page-buffer page-container">
      <PageTitle className="flex gap-4 items-center">
        <Button
          variant="icon-white"
          onClick={() =>
            navigate({
              to: "/user-gardens",
            })
          }
          className="!-my-8"
          icon={<MdArrowBack />}
        />
        {gardenName}
      </PageTitle>

      <LoadingOverlay
        debounceShow
        transparent
        show={gardenPlantsQuery.loading || gardenQuery.loading}
        className="absolute"
      />

      <PlantSelectionProvider
        plantList={gardenPlants?.results ?? []}
        totalItems={gardenPlantsCount}
        {...{ page, pageSize }}
      >
        <FloatingHeader>
          <ItemCountWithLoader
            className="col-start-2"
            label="Plant"
            count={gardenPlantsCount}
          />

          <PaginationControl
            className="ml-auto"
            totalItems={gardenPlantsCount}
            replaceUrl
            {...{ page, pageSize }}
          />
        </FloatingHeader>
        <PlantList />
      </PlantSelectionProvider>
    </main>
  );
};

export default Garden;
