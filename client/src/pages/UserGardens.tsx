import PlantCard from "components/plantResults/PlantCard";
import { VOID_FUNCTION } from "contexts/PlantSearchContext";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { CREATE_GARDEN, GET_ALL_GARDENS } from "graphqlHelpers/gardenQueries";
import { useApolloMutation, useApolloQuery } from "hooks/useQuery";
import { useEffect } from "react";

const UserGardens = () => {
  const userGardensQuery = useApolloQuery(GET_ALL_GARDENS, {});
  const allUserGardens = userGardensQuery.data?.allUserGardens;

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
    <main className="px-2 pb-10">
      <PageTitle>Gardens</PageTitle>
      {userGardensQuery.loading ? (
        <LoadingOverlay show />
      ) : allUserGardens?.length ? (
        allUserGardens.map((garden, index) => (
          <Card key={index}>
            <h3>{garden.gardenName}</h3>
            <div className="flex flex-wrap gap-4">
              {garden.plants.map((plant, index) => (
                <PlantCard
                  key={index}
                  {...{ plant, index }}
                  isActive={false}
                  setActive={VOID_FUNCTION}
                />
              ))}
            </div>
          </Card>
        ))
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
