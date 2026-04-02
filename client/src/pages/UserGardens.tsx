import { useNavigate } from "@tanstack/react-router";
import CreateGardenModal from "components/garden/CreateGardenModal";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { GET_ALL_GARDENS } from "graphqlHelpers/gardenQueries";
import { useApolloQuery } from "hooks/useQuery";
import pluralize from "pluralize";
import { useState } from "react";

const UserGardens = () => {
  const navigate = useNavigate();
  const [showCreateGardenModal, setShowCreateGardenModal] = useState(false);

  const userGardensQuery = useApolloQuery(GET_ALL_GARDENS, {
    fetchPolicy: "cache-and-network",
  });
  const allUserGardens = userGardensQuery.data?.allUserGardens;

  return (
    <main className="page-buffer page-container">
      <PageTitle>Gardens</PageTitle>

      <LoadingOverlay
        debounceShow={Boolean(userGardensQuery.previousData)}
        transparent
        show={
          userGardensQuery.loading && userGardensQuery.dataState !== "complete"
        }
        className="absolute top-0 left-0"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {allUserGardens?.map(({ gardenName, plantCount }, index) => (
          <Card
            key={index}
            className="space-y-2 cursor-pointer min-w-xs"
            solidOnHover
            onClick={() =>
              navigate({ to: "/gardens/$gardenName", params: { gardenName } })
            }
          >
            <h2 className="border-b border-secondary pb-2">{gardenName}</h2>
            <h4>{pluralize("plant", plantCount, true)}</h4>
          </Card>
        ))}
      </div>
      <Button className="w-fit" onClick={() => setShowCreateGardenModal(true)}>
        Create a garden
      </Button>
      <CreateGardenModal
        isOpen={showCreateGardenModal}
        onClose={(gardenCreated) => {
          setShowCreateGardenModal(false);
          gardenCreated && userGardensQuery.refetch();
        }}
      />
    </main>
  );
};

export default UserGardens;
