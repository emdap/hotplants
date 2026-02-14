import Button, { ButtonProps } from "designSystem/Button";
import { MdFilterAlt, MdOutlineFilterAlt } from "react-icons/md";

const FilterButton = ({
  filtersApplied,
  ...buttonProps
}: { filtersApplied: boolean } & Omit<ButtonProps, "icon">) => (
  <Button
    variant="icon-white"
    {...buttonProps}
    icon={filtersApplied ? <MdFilterAlt /> : <MdOutlineFilterAlt />}
  />
);

export default FilterButton;
