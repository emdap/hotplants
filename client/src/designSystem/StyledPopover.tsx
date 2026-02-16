import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
} from "@headlessui/react";
import classNames from "classnames";
import { ReactNode } from "react";

const StyledPopover = ({
  button,
  children,
  className,
  ...panelProps
}: {
  button: ReactNode;
} & PopoverPanelProps) => (
  <Popover>
    <PopoverButton as="div" className="data-active:[&_button]:outline-2">
      {button}
    </PopoverButton>

    <PopoverPanel
      anchor="bottom end"
      modal={false}
      className={classNames(
        "z-20 py-2 px-3 mt-3 text-sm outline-none bg-default-background shadow-sm rounded-md space-y-2",
        className,
      )}
      {...panelProps}
    >
      {typeof children === "function" ? (props) => children(props) : children}
    </PopoverPanel>
  </Popover>
);

export default StyledPopover;
