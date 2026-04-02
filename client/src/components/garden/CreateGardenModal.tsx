import Button from "designSystem/Button";
import Form from "designSystem/Form";
import InputField from "designSystem/InputField";
import Modal from "designSystem/Modal";
import { CREATE_GARDEN } from "graphqlHelpers/gardenQueries";
import { useApolloMutation } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { defaultErrorToast } from "util/toastUtil";

const CreateGardenModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (gardenCreated?: boolean) => void;
}) => {
  const [gardenName, setGardenName] = useState("");

  useEffect(() => {
    !isOpen && setGardenName("");
  }, [isOpen]);

  const [createGarden, { loading, error }] = useApolloMutation(CREATE_GARDEN);

  const createGardenAndRefetch = async () => {
    try {
      const { data } = await createGarden({ variables: { gardenName } });
      if (data?.createGarden) {
        toast.success(`Created new garden "${data.createGarden.gardenName}"`);
        onClose(true);
      } else {
        defaultErrorToast();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal title="Create new garden" isOpen={isOpen} onClose={() => onClose()}>
      <Form
        className="space-y-8 mt-4"
        onSubmit={createGardenAndRefetch}
        disabled={!gardenName || loading}
      >
        <InputField
          id="garden-name"
          type="text"
          label="Garden name"
          value={gardenName}
          onChange={({ target }) => setGardenName(target.value)}
          isError={!!error}
          errorText={error?.message}
        />
        <Button isLoading={loading} type="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default CreateGardenModal;
