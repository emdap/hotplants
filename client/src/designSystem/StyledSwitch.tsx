import { Switch } from "@headlessui/react";
import classNames from "classnames";

export type StyledSwitchProps = {
  enabled: boolean;
  label?: string;
  className?: string;
  setEnabled: (enabled: boolean) => void;
};

const StyledSwitch = ({
  enabled,
  label,
  className,
  setEnabled,
}: StyledSwitchProps) => (
  <div className={classNames("flex gap-2 items-center", className)}>
    {label && (
      <span onClick={() => setEnabled(!enabled)} className="cursor-pointer">
        {label}
      </span>
    )}
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative flex h-4 w-8 cursor-pointer rounded-full bg-primary-dark/40 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-primary-dark/80 data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-2 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-4"
      />
    </Switch>
  </div>
);

export default StyledSwitch;
