import { usePlantSelectionContext } from "contexts/plantSelection/PlantSelectionContext";
import Button from "designSystem/Button";
import ItemCountWithLoader from "designSystem/ItemCountWithLoader";
import Modal, { ModalProps } from "designSystem/Modal";
import ClearPlantFiltersButton from "./ClearPlantFiltersButton";
import PlantFiltersBody from "./PlantFiltersBody";

const PlantFiltersModal = (
  props: Pick<ModalProps, "isOpen" | "onClose" | "className">,
) => {
  const { plantListLoading, totalItems } = usePlantSelectionContext();

  return (
    <Modal
      title="Filter plants"
      subTitle={
        <Button variant="text" size="flush" onClick={props.onClose}>
          <ItemCountWithLoader
            label="plant"
            count={totalItems}
            isLoading={plantListLoading}
          />
        </Button>
      }
      {...props}
    >
      <PlantFiltersBody omitTitle />
      <div className="flex gap-2">
        {props.isOpen && (
          <Button className="grow" onClick={props.onClose}>
            View plants
          </Button>
        )}
        <ClearPlantFiltersButton
          className="grow"
          variant={props.isOpen ? "secondary" : "primary"}
        />
      </div>
    </Modal>
  );
};

export default PlantFiltersModal;
