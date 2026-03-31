import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverPanelProps,
  Transition,
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
    <PopoverButton as="div" className="data-active:[&_button]:outline-2 w-fit">
      {button}
    </PopoverButton>

    <Transition
      // Copied from headless-ui's example
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel
        anchor="bottom end"
        modal={false}
        className={classNames(
          "z-30 p-4 mt-3 text-sm card card-solid data-closed:scale-95",
          className,
        )}
        {...panelProps}
      >
        {typeof children === "function" ? (props) => children(props) : children}
      </PopoverPanel>
    </Transition>
  </Popover>
);

export default StyledPopover;
