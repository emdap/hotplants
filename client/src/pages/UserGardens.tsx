import { useNavigate } from "@tanstack/react-router";
import CreateGardenModal from "components/garden/CreateGardenModal";
import DeleteGardenModal from "components/garden/DeleteGardenModal";
import Button from "designSystem/Button";
import Card from "designSystem/Card";
import LoadingOverlay from "designSystem/LoadingOverlay";
import PageTitle from "designSystem/PageTitle";
import { GET_ALL_GARDENS, UserGarden } from "graphqlHelpers/gardenQueries";
import { useApolloQuery } from "hooks/useQuery";
import pluralize from "pluralize";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";

const UserGardens = () => {
  const navigate = useNavigate();
  const [showCreateGardenModal, setShowCreateGardenModal] = useState(false);
  const [showDeleteGardenModal, setShowDeleteGardenModal] =
    useState<null | UserGarden>(null);

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
        {allUserGardens?.map((garden, index) => (
          <Card
            key={index}
            className="space-y-2 cursor-pointer min-w-xs"
            solidOnHover
            onClick={() =>
              navigate({
                to: "/gardens/$gardenName",
                params: { gardenName: garden.gardenName },
              })
            }
          >
            <h2 className="border-b border-secondary pb-2 flex justify-between items-center">
              {garden.gardenName}
              <Button
                variant="icon-white"
                size="flush"
                className="opacity-40"
                icon={<MdOutlineDeleteForever size={20} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteGardenModal(garden);
                }}
              />
            </h2>
            <h4>{pluralize("plant", garden.plantCount, true)}</h4>
          </Card>
        ))}
      </div>
      <Button className="w-fit" onClick={() => setShowCreateGardenModal(true)}>
        Create a garden
      </Button>

      <DeleteGardenModal
        garden={showDeleteGardenModal}
        isOpen={Boolean(showDeleteGardenModal)}
        onClose={(gardenDeleted) => {
          setShowDeleteGardenModal(null);
          gardenDeleted && userGardensQuery.refetch();
        }}
      />
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
