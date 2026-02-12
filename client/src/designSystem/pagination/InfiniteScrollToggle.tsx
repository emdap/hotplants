import { Switch } from "@headlessui/react";

export type InfiniteScrollToggleProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

const InfiniteScrollToggle = ({
  enabled,
  setEnabled,
}: InfiniteScrollToggleProps) => (
  <div className="flex gap-2 items-center">
    <span onClick={() => setEnabled(!enabled)} className="cursor-pointer">
      Infinite Scroll
    </span>
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className="group relative flex h-4 w-8 cursor-pointer rounded-full bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/50 data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-2 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-4 group-data-checked:bg-primary-dark"
      />
    </Switch>
  </div>
);

export default InfiniteScrollToggle;
