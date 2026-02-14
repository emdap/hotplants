import { MdFilterAlt, MdOutlineFilterAlt } from "react-icons/md";
import IconButton, { IconButtonVariantProps } from "./IconButton";

const FilterButton = (props: IconButtonVariantProps) => (
  <IconButton
    {...props}
    icon={props.active ? <MdFilterAlt /> : <MdOutlineFilterAlt />}
  />
);

export default FilterButton;
