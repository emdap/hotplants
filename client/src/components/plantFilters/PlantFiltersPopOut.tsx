import classNames from "classnames";
import StyledPopover from "designSystem/StyledPopover";
import { useState } from "react";
import { isSmallScreen } from "util/generalUtil";
import ClearPlantFiltersButton from "./ClearPlantFiltersButton";
import PlantFiltersBody from "./PlantFiltersBody";
import PlantFiltersButton from "./PlantFiltersButton";
import PlantFiltersModal from "./PlantFiltersModal";

const PlantFiltersPopOut = () => {
  const [showModal, setShowModal] = useState(false);
  const containerClassName = "flex flex-col gap-2 pt-2";

  return isSmallScreen() ? (
    <>
      <PlantFiltersModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="containerClassName"
      />
      <PlantFiltersButton onClick={() => setShowModal(true)} />
    </>
  ) : (
    <StyledPopover
      anchor="bottom start"
      className={classNames(
        "h-dvh-header-8 min-h-[400px] z-50 flex flex-col gap-2 pt-2",
        containerClassName,
      )}
      button={<PlantFiltersButton />}
    >
      <PlantFiltersBody />

      <ClearPlantFiltersButton />
    </StyledPopover>
  );
};

export default PlantFiltersPopOut;
