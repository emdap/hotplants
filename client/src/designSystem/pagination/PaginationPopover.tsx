import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ReactNode } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import Button from "../Button";

const PaginationPopover = ({ children }: { children: ReactNode }) => (
  <Popover>
    <PopoverButton as="div" className="data-active:[&_button]:outline-2">
      <Button size="small" variant="icon-white" icon={<MdOutlineMoreVert />} />
    </PopoverButton>

    <PopoverPanel
      anchor="bottom end"
      modal={false}
      className="z-20 py-2 px-3 mt-3 text-sm outline-none bg-default-background shadow-sm rounded-md space-y-2"
    >
      {children}
    </PopoverPanel>
  </Popover>
);

export default PaginationPopover;
