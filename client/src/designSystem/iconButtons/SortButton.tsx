import { MdSort } from "react-icons/md";
import IconButton, { IconButtonVariantProps } from "./IconButton";

const SortButton = (props: IconButtonVariantProps) => (
  <IconButton {...props} icon={<MdSort />} />
);

export default SortButton;
