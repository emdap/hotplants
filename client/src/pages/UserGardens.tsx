import { getRouteApi, useNavigate } from "@tanstack/react-router";
import PlantList from "components/plantResults/PlantList";
import PlantSelectionProvider from "contexts/plantSelection/PlantSelectionProvider";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import {
  CREATE_GARDEN,
  GET_ALL_GARDEN_NAMES,
  GET_GARDEN,
} from "graphqlHelpers/gardenQueries";
import { useApolloMutation, useApolloQuery } from "hooks/useQuery";
import { useEffect } from "react";
import { MdArrowBack } from "react-icons/md";

const route = getRouteApi("/_private/gardens/{-$gardenName}");

const UserGardens = () => {
  const navigate = useNavigate();
  const { gardenName } = route.useParams();
  const userGardensQuery = useApolloQuery(GET_ALL_GARDEN_NAMES, {
    skip: Boolean(gardenName),
  });
  const allUserGardens = userGardensQuery.data?.allUserGardens;

  const getGardenQuery = useApolloQuery(GET_GARDEN, {
    variables: { gardenName: gardenName! },
    skip: !gardenName,
  });
  const [createGarden, { loading: createGardenLoading }] =
    useApolloMutation(CREATE_GARDEN);

  const createGardenAndRefetch = async () => {
    await createGarden();
    userGardensQuery.refetch();
  };

  useEffect(() => {
    userGardensQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="page-buffer relative">
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

      {gardenName ? (
        <PlantSelectionProvider
          plantList={getGardenQuery.data?.userGarden?.plants ?? []}
        >
          <PlantList />
        </PlantSelectionProvider>
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
