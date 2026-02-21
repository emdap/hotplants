import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantList from "components/plantResults/PlantList";
import { PaginationContext } from "contexts/pagination/PaginationContext";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import FloatingHeader from "designSystem/FloatingHeader";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { PaginationControl } from "designSystem/pagination/PaginationControl";
import {
  CREATE_GARDEN,
  GET_ALL_GARDEN_NAMES,
  GET_GARDEN,
} from "graphqlHelpers/gardenQueries";
import { DEFAULT_PAGE_SIZE } from "hooks/usePlantSearchQueries";
import { useApolloMutation, useApolloQuery } from "hooks/useQuery";
import pluralize from "pluralize";
import { MdArrowBack } from "react-icons/md";
import { getLastPage } from "util/generalUtil";

const route = getRouteApi("/_private/gardens/{-$gardenName}");

const UserGardens = () => {
  const navigate = useNavigate();
  const { gardenName } = route.useParams();
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = route.useSearch();

  const userGardensQuery = useApolloQuery(GET_ALL_GARDEN_NAMES, {
    skip: Boolean(gardenName),
    fetchPolicy: "cache-and-network",
  });
  const allUserGardens = userGardensQuery.data?.allUserGardens;

  const getGardenQuery = useApolloQuery(GET_GARDEN, {
    variables: { gardenName: gardenName! },
    skip: !gardenName,
    fetchPolicy: "cache-and-network",
  });

  const [createGarden, { loading: createGardenLoading }] =
    useApolloMutation(CREATE_GARDEN);

  const createGardenAndRefetch = async () => {
    await createGarden();
    userGardensQuery.refetch();
  };

  const gardenPlantsCount = getGardenQuery.data?.userGarden?.totalPlants;
  const lastPage = getLastPage(pageSize, gardenPlantsCount);

  return (
    <main className="page-buffer page-container">
      <PageTitle key={gardenName}>
        {gardenName ? (
          <span className="flex gap-4 items-center">
            <MdArrowBack
              className="cursor-pointer"
              onClick={() =>
                navigate({
                  to: ".",
                  params: { gardenName: undefined },
                })
              }
            />
            {gardenName}
          </span>
        ) : (
          "Gardens"
        )}
      </PageTitle>

      <LoadingOverlay
        debounceShow
        show={getGardenQuery.loading || createGardenLoading}
        size={30}
        className="absolute w-full h-80 animate-pulse"
      />

      {/* TODO: This should be a separate component */}
      {gardenName ? (
        <PaginationContext.Provider value={{ page, pageSize, lastPage }}>
          <PlantSelectionProvider
            plantList={getGardenQuery.data?.userGarden?.plants ?? []}
          >
            <FloatingHeader>
              <span className="col-start-2">
                {pluralize("Plant", gardenPlantsCount, true)}
              </span>
              <PaginationControl
                className="ml-auto"
                replaceUrl
                {...{ page, pageSize, lastPage }}
              />
            </FloatingHeader>
            <PlantList />
          </PlantSelectionProvider>
        </PaginationContext.Provider>
      ) : allUserGardens?.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {allUserGardens.map(({ gardenName, totalPlants }, index) => (
            <Card
              key={index}
              className="space-y-2 cursor-pointer min-w-xs"
              solidOnHover
              onClick={() => navigate({ to: gardenName })}
            >
              <h2 className="border-b border-secondary pb-2">{gardenName}</h2>
              <h4>{totalPlants} plants</h4>
            </Card>
          ))}
        </div>
      ) : (
        <Button
          isLoading={createGardenLoading}
          variant="accent"
          onClick={createGardenAndRefetch}
        >
          Create a garden
        </Button>
      )}
    </main>
  );
};

export default UserGardens;
