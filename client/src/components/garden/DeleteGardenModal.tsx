import Button from "designSystem/Button";
import Form from "designSystem/Form";
import InputField from "designSystem/InputField";
import Modal from "designSystem/Modal";
import { DELETE_GARDEN, UserGarden } from "graphqlHelpers/gardenQueries";
import { useApolloMutation } from "hooks/useQuery";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultErrorToast } from "util/toastUtil";

const DeleteGardenModal = ({
  garden,
  isOpen,
  onClose,
}: { garden: UserGarden | null } & {
  isOpen: boolean;
  onClose: (gardenDeleted?: boolean) => void;
}) => {
  const [deleteGardenName, setDeleteGardenName] = useState("");

  useEffect(() => {
    !isOpen && setDeleteGardenName("");
  }, [isOpen]);

  const [deleteGarden, { loading, error }] = useApolloMutation(DELETE_GARDEN);

  const deleteGardenAndRefetch = async () => {
    if (!garden) {
      return;
    }

    try {
      const { data } = await deleteGarden({
        variables: { gardenId: garden._id },
      });
      if (data?.deleteGarden) {
        toast.success(`Deleted garden "${garden.gardenName}"`);
        onClose(true);
      } else {
        defaultErrorToast();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disableSubmit = loading || deleteGardenName !== garden?.gardenName;

  return (
    <Modal title="Delete garden" {...{ isOpen, onClose }}>
      <Form
        onSubmit={deleteGardenAndRefetch}
        disabled={disableSubmit}
        className="space-y-8 mt-4"
      >
        <div className="flex flex-col gap-2">
          <strong>
            This action is irreversible. <br /> There are{" "}
            {pluralize("plant", garden?.plantCount, true)} in this garden.
          </strong>
          Confirm the garden name "{garden?.gardenName}" to proceed.
        </div>
        <InputField
          id="garden-name"
          type="text"
          label="Delete garden"
          placeholder="Enter garden name"
          value={deleteGardenName}
          onChange={({ target }) => setDeleteGardenName(target.value)}
          isError={!!error}
          errorText={error?.message}
        />
        <Button
          variant="danger"
          isLoading={loading}
          type="submit"
          disabled={disableSubmit}
        >
          Delete
        </Button>
      </Form>
    </Modal>
  );
};

export default DeleteGardenModal;
