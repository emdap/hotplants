import { HiSwitchVertical } from "react-icons/hi";
import IconButton, { IconButtonVariantProps } from "./IconButton";

const SortButton = (props: IconButtonVariantProps) => (
  <IconButton {...props} icon={<HiSwitchVertical />} />
);

export default SortButton;
